import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import authService from '@/services/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'login' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/users',
    name: 'user-list',
    component: () => import('@/views/UserList.vue'),
    meta: {
      requireAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// navigation guard, protect annoymous user from access authenicaton required routes
router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requireAuth)
  const currentUser = await authService.getCurrentUser()

  if (requireAuth && !currentUser) {
    next({name: 'login'})
  } else {
    next()
  }
})

export default router