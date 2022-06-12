import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'

  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('views/login/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('views/home/Home.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 判断用户访问的是是不是登录页
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
// 挂载路由守卫