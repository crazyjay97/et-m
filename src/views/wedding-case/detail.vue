<template>
  详情

  <div v-for="item in dataList.list">
    <el-image v-if="-1 == (item.name.indexOf('mp4'))" :src="`file://${item.path}`"></el-image>
    <video v-else :src="`file://${item.path}`" controls="controls"></video>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive} from 'vue'
import WeddingProvider, {IAttachment} from "@/provider/wedding"
import {useRoute} from 'vue-router'
import 'video.js/dist/video-js.css'

export default defineComponent({
  setup() {
    onMounted(() => {
      const route = useRoute()
      const id: string = route.params.id + ''
      loadData(parseInt(id))
    })
    const dataList = reactive({
      list: [] as IAttachment[]
    })
    const db = new WeddingProvider()
    const loadData = (id: number) => {
      db.attachment.where('weddingId').equals(id).toArray().then((atts: IAttachment[]) => {
        console.log(atts)
        dataList.list = atts
      })
    }
    return {
      loadData,
      dataList
    }
  }
})
</script>
