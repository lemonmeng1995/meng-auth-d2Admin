import axios from 'axios'
import router from '@/router/index'
import qs from 'qs'
import util from '@/libs/util'
import { errorLog, CreateMessage } from './tools'

/**
 * @description 创建请求实例
 */
// 创建一个 axios 实例
console.log('当前环境', process.env.VUE_APP_API)
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 20000 // 请求超时时间
})
// 请求拦截
service.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      // if(config.data.file){
      //   config.headers["content-type"] = "multipart/form-data";
      // }else{
      //   config.headers["content-type"] = "application/x-www-form-urlencoded";
      // }
      config.headers['content-type'] = 'application/x-www-form-urlencoded'
      // config.headers["content-type"] = "multipart/form-data";
      config.data = qs.stringify(config.data)
    }
    const token = util.cookies.get('token')
    if (token) {
      config.headers.common.Authorization = token
    }
    return config
  },
  error => {
    // 发送失败

    return Promise.reject(error)
  }
)

const myMessage = new CreateMessage()
// 响应拦截
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    if (dataAxios.code !== '0') {
      myMessage.error(dataAxios.msg)
      if (dataAxios.code === '20_00_1_00006') {
        setTimeout(() => {
          router.replace({
            name: 'login'
          })
        }, 1000)
      }
    }
    return dataAxios
  },
  error => {
    if (error.response && error.response.status === 500) {
      errorLog(new Error(`系统错误!: ${error.config.url}`))
    } else if (error.message && error.message.indexOf('timeout') > -1) {
      errorLog(new Error(`网络超时!: ${error.config.url}`))
    } else if (error.type === '403') {
      errorLog(new Error(`没有请求权限!: ${error.config.url}`))
    } else {
      errorLog(new Error(`网络错误!: ${error.config.url}`))
    }
    return Promise.reject(error)
  }
)

export default service
