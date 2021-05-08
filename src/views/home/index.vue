<template>
    <div class="home-wrap">
        <div class="menu-wrap">
            <el-button class="home-btn" type="primary" @click="toLink('Wedding-Case')">婚礼案例</el-button>
            <el-button class="home-btn" type="primary">摄影</el-button>
            <el-button class="home-btn" type="primary">摄像</el-button>
            <el-button class="home-btn" type="primary">主持人</el-button>
        </div>

        <el-button class="home-setting" icon="el-icon-s-tools" type="text" @click="changeBg"></el-button>
    </div>
</template>
<script lang="ts">
    import './index.sass'
    import {defineComponent} from 'vue'
    import router from "@/router"

    export default defineComponent({
        setup() {
            const changeBg = () => {
                console.log()
            }
            const toLink = (name: string) => {
                router.push({
                    name: name
                })
            }
            return {
                changeBg,
                toLink
            }
        }
    })
</script>
