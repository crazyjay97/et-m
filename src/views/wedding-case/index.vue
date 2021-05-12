<template>
  <div class="wedding-wrap">
    <el-button type="text" @click="add" class="add-btn" icon="el-icon-plus"></el-button>
    <div class="color-card-wrap">
      <div v-for="item in dataList.list" class="color-card"
           :style="{background:`linear-gradient(180deg,${item.colorValue},98%,#FFB6C1)`}">
        {{ item.colorName }}
        <div class="color-card-detail">
          {{ item.desc }}
        </div>
        <el-button class="remove-btn" type="text" icon="el-icon-delete-solid"
                   @click="removeById(item.id)"></el-button>
        <el-button class="detail-btn" type="text" icon="el-icon-rank"
                   @click="showDetail(item.id)"></el-button>
      </div>
    </div>
    <el-drawer
        title="添加"
        v-model="showAdd"
        :before-close="handleClose"
        destroy-on-close>
      <el-form ref="saveFormEl" :model="formData" label-position="top">
        <el-row justify="20">
          <el-col :span="24">
            <el-form-item prop="colorName" label="名称" :rules="[
                                    {
                                        required: true,
                                        message: '必填项',
                                        trigger: 'change'
                                    }
                                ]">
              <el-input v-model="formData.colorName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="colorValue" label="颜色(16进制)" :rules="[
                                    {
                                        required: true,
                                        message: '必填项',
                                        trigger: 'change'
                                    }
                                ]">
              <el-input v-model="formData.colorValue"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="cost" label="成本" :rules="[
                                    {
                                        required: true,
                                        message: '必填项',
                                        trigger: 'change'
                                    }
                                ]">
              <el-input v-model="formData.cost"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="price" label="价格" :rules="[
                                    {
                                        required: true,
                                        message: '必填项',
                                        trigger: 'change'
                                    }
                                ]">
              <el-input v-model="formData.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="desc" label="描述">
              <el-input type="textarea" v-model="formData.desc"
                        :autosize="{ minRows: 4, maxRows: 8}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="attachment" label="附件">
              <el-upload
                  ref="uploadEl"
                  class="upload-demo"
                  action="xx"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :http-request="saveFile"
                  :file-list="formData.attachment"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">只能选择 jpg/png/mp4 文件</div>
                </template>
              </el-upload>

            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" style="width: 100%" @click="saveForm">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>

  </div>

</template>
<script lang="ts">
import './index.sass'
import {defineComponent, onMounted, reactive, ref} from 'vue'
import WeddingProvider, {IAttachment} from '@/provider/wedding'
import WeddingDatabase, {IWedding} from '@/provider/wedding'
import {ElMessage, ElMessageBox} from 'element-plus'
import {uuid} from "@/utils/utils";
import router from "@/router"

const fs = window.require('fs')
const pathUtil = require('path')

interface FormModel {
  colorName: string
  colorValue: string
  desc: string
  price: number
  cost: number
  attachment: FileInfo []
}

interface FileInfo {
  id?: number
  name: string
  url: string
}

export default defineComponent({
  setup() {
    const db = new WeddingProvider()
    const dataList = reactive({
      list: [] as IWedding[]
    })
    const saveFormEl = ref()
    const uploadEl = ref()
    const formData = reactive({}) as FormModel
    const showAdd = ref(false)
    const loadData = () => {
      db.wedding.toCollection().toArray().then((weddingList: IWedding[]) => {
        dataList.list = weddingList
      })
    }
    onMounted(() => {
      showAdd.value = false
      loadData()
    })
    const add = () => {
      showAdd.value = true
    }
    const showDetail = (id: number) => {
      router.push({
        name: 'Wedding-Detail',
        params: {
          id
        }
      })
    }
    const removeById = (id: number) => {
      db.wedding.delete(id).then(() => {
        db.attachment.where('weddingId').equals(id).toArray().then((atts: IAttachment[]) => {
          atts.forEach(att => {
            if (att.id) {
              db.attachment.delete(att.id)
            }
            fs.unlinkSync(att.path)
          })
        }).catch(err => {
          console.log(err)
        })
        loadData()
      })
    }
    const handleClose = () => {
      showAdd.value = false
      saveFormEl.value.resetFields({})
      uploadEl.value.clearFiles()
    }
    const handleRemove = (file: any, fileList: any[]) => {
      console.log(file, fileList)
    }
    const beforeRemove = (file: any, fileList: any[]) => {
      return ElMessageBox.confirm(`确定移除 ${file.name}？`);
    }
    const saveFile = (r: any) => {
      const path = pathUtil.join(fs.realpathSync('.'), uuid() + r.file.name)
      fs.writeFileSync(path, fs.readFileSync(r.file.path));
      formData.attachment = [...(formData.attachment ? formData.attachment : []), {
        name: r.file.name,
        url: path
      }]
    }
    const saveForm = () => {
      saveFormEl.value.validate((valid: boolean) => {
        if (valid) {
          const db = new WeddingDatabase()
          db.wedding.put({
            colorName: formData.colorName,
            colorValue: formData.colorValue,
            desc: formData.desc,
            cost: formData.cost,
            price: formData.price,
          }).then(id => {
            if (formData.attachment) {
              const ps: Promise<any>[] = []
              formData.attachment.forEach(r => {
                if (!r.id) {
                  ps.push(db.attachment.put({
                    weddingId: id,
                    name: r.name,
                    path: r.url
                  }))
                }
              })
              Promise.all(ps).then(() => {
                ElMessage({
                  type: 'success',
                  message: '保存成功',
                  duration: 2000,
                  onClose: () => {
                    showAdd.value = false
                  }
                })
              })
            } else {
              ElMessage({
                type: 'success',
                message: '保存成功',
                duration: 2000,
                onClose: () => {
                  showAdd.value = false
                  setTimeout(() => {
                    loadData()
                  }, 1000)
                }
              })
            }
          })
        }
      })
    }
    return {
      add,
      showAdd,
      dataList,
      handleClose,
      formData,
      handleRemove,
      beforeRemove,
      saveFile,
      saveFormEl,
      saveForm,
      uploadEl,
      removeById,
      showDetail
    }
  }
})
</script>
