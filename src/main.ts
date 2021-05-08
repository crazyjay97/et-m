import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/style/index.sass'
import './assets/ele/F788A9/index.css'


createApp(App).use(ElementPlus).use(store).use(router).mount('#app')
