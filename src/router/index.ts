import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/home',
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'todo',
          name: 'todo',
          component: () => import('../views/todo/index.vue'),
          meta: { title: '今日待办' }
        },
        {
          path: 'all-incidents',
          name: 'allIncidents',
          component: () => import('../views/all-incidents/index.vue'),
          meta: { title: '全部警情' }
        },
        {
          path: 'police-approval',
          name: 'policeApproval',
          component: () => import('../views/police/index.vue'),
          meta: { title: '处警审批' }
        },
        {
          path: 'modify',
          name: 'modify',
          component: () => import('../views/modify/index.vue'),
          meta: { title: '警情修改' }
        },
         {
          path: 'transfer',
          name: 'TransferPage',
          component: () => import('../views/transfer/index.vue'),
          meta: { title: '移送警情管理' }
        },
      ]
    },
  ],
})

export default router