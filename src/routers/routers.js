import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path:'',
        name:'login-link',
        component:() => import('../views/Login.vue')
    },
    {
        path:'/products',
        name:'product-link',
        component:() => import('../views/Products.vue')
    },
    {
        path:'/records',
        name:'record-link',
        component:() => import('../views/Record.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;