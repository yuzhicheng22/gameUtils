import {createRouter, createWebHistory, RouterView, type RouteRecordRaw, createWebHashHistory} from 'vue-router'
import {PageEnum} from "@/enums/pageEnum";
export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/error/404.vue')
    },
    {
        path: PageEnum.ERROR_403,
        component: () => import('@/views/error/403.vue')
    },
    {
        path: PageEnum.INDEX,
        component: () => import('@/views/home/Index.vue')
    },
    {
        path: PageEnum.ExcelConfig,
        component: () => import('@/views/excel/config.vue')
    },
    {
        path: PageEnum.Excel,
        component: () => import('@/views/excel/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: constantRoutes
})

export default router
