import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Layout from '../components/layout/index.vue'
import Home from '../views/home/index.vue'
import WeddingCase from '../views/wedding-case/index.vue'
import WeddingDetail from '../views/wedding-case/detail.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: '/Home',
        children: [
            {
                path: '/Home',
                name: 'Home',
                component: Home
            },
            {
                path: '/Wedding-Case',
                name: 'Wedding-Case',
                component: WeddingCase
            },
            {
                path: '/Wedding-Detail',
                name: 'Wedding-Detail',
                component: WeddingDetail
            }
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
