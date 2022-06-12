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

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')