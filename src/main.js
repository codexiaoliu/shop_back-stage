import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入element ui
import "./plugins/element"
// 导入基础样式
import "./assets/css/global.css"
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入 axios
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'
// 引入Dayjs
import dayjs from "dayjs"




axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 这里是axios的请求拦截器 
// 用来给请求头的Authorization属性添加token  作为后续请求接口的权限
// 但是注意只有登录以后服务器才会发送给浏览器一个token 并且保存在sessionStorage中 作为后续获取数据的令牌
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.prototype.dayjs = dayjs;



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')