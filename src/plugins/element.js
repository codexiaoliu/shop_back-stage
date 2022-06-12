import Vue from 'vue'
// 不导入这个没组件样式
import 'element-ui/lib/theme-chalk/index.css';
// element ui 按需导入
import {
    Button,
    Form,
    FormItem,
    Input,
    Message
} from 'element-ui'



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message