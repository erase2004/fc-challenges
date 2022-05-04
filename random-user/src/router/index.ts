import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import authService from '@/services/auth'
import { useStore } from '@/stores/ui'

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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// navigation guard, protect annoymous user from access authenicaton required routes
router.beforeEach(async (to, from, next) => {
  const uiStore = useStore()
  uiStore.pageLoading = true

  const requireAuth = to.matched.some(record => record.meta.requireAuth)
  const currentUser = await authService.getCurrentUser()

  if (requireAuth === true && !currentUser) {
    // access authenication required routes without authenication

    next({name: 'login'})
  } else {
    if (requireAuth === false) {
      if (currentUser) {
        next({name: 'user-list'})
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  const uiStore = useStore()
  uiStore.pageLoading = false
})

export default router