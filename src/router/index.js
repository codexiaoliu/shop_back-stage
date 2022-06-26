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
    redirect: '/welcome',
    component: () => import('views/home/Home.vue'),
    children: [{
        path: '/welcome',
        name: 'Welcome',
        component: () => import('views/home/childrens/Welcome.vue')
      },
      {
        path: '/users',
        name: 'User',
        component: () => import('views/home/childrens/User.vue')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('views/home/childrens/Roles.vue')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('views/home/childrens/Rights.vue')
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('views/home/shop/Categories.vue')
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import('views/home/shop/Params.vue')
      },
    ]
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