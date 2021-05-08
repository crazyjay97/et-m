<template>
    <router-view/>
    <el-button class="go-home-btn" v-show="!isHome" type="text" icon="el-icon-s-home" @click="goHome"></el-button>
</template>
<script lang="ts">
    import {defineComponent, ref, watchEffect} from 'vue'
    import './index.sass'
    import router from "@/router"

    export default defineComponent({
        setup() {
            const isHome = ref(false)
            watchEffect(() => isHome.value = (router.currentRoute.value.name == 'Home'))
            const goHome = () => {
                router.push({
                    name: 'Home'
                })
            }
            return {
                goHome,
                isHome
            }
        }
    })
</script>
