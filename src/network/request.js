import axios from 'axios'
export function request(config) {
    // 创建axios实例
    const instance = axios.create({
        baseURL: '',
        timeout: 5000
    })

    // axios拦截器
    instance.interceptors.request.use(config => {
        return config
    }, err => {

    })

    // 响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {

    })

    // 发送真正的网络请求
    return instance(config)
}