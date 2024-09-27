import request from 'axios'
import { ElMessage } from 'element-plus'
const http = request.create({
    baseURL: 'https:/v3pz.itndedu.com/v3pz',
    timeout: 10000
})
http.interceptors.request.use(function (config) {
    const token = localStorage.getItem('pz_token')
    const writeurl = ['/get/code', '/user/authentication', '/login']
    if (token && !writeurl.includes(config.url)) {
        config.headers['x-token'] = token
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

http.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === -1) {
        ElMessage.warning(response.data.message)
    }
    if (response.data.code === -2) {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        location.href = '/login'
    }
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
})
export default http