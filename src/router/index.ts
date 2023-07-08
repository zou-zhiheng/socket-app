import { createRouter, createWebHashHistory } from 'vue-router';

const routes:any = [
  
    {
        path: '/',
        name: 'Login',
        component: () => import('../view/login.vue')
    },
    {
        path: '/group',
        name: 'Group',
        redirect: '/debug',
        component: () => import('../view/group/index.vue'),
        children: [
            {
                path: "/debug",
                name: 'Debug',
                component: () => import('../view/group/debug.vue')
            },
            {
                path: "/visualization",
                name: 'Visualization',
                component: () => import('../view/group/visualization.vue')
            },
            {
                path: "/device",
                name: 'Device',
                component: () => import('../view/group/device.vue')
            },
            {
                path: "/user",
                name: 'User',
                component: () => import('../view/group/user.vue')
            },
            {
                path: "/api",
                name: 'api',
                component: () => import('../view/group/api.vue')
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;