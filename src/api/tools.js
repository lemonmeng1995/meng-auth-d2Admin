import { Message } from 'element-ui'
import store from '@/store'
import util from '@/libs/util'
import cryptoJs from 'crypto-js'

/**
 * @description 安全地解析 json 字符串
 * @param {String} jsonString 需要解析的 json 字符串
 * @param {String} defaultValue 默认值
 */
export function parse (jsonString = '{}', defaultValue = {}) {
  let result = defaultValue
  try {
    result = JSON.parse(jsonString)
  } catch (error) {
    console.log(error)
  }
  return result
}

/**
 * @description 接口请求返回
 * @param {Any} data 返回值
 * @param {String} msg 状态信息
 * @param {Number} code 状态码
 */
export function response (data = {}, msg = '', code = 0) {
  return [
    200,
    { code, msg, data }
  ]
}

/**
 * @description 接口请求返回 正确返回
 * @param {Any} data 返回值
 * @param {String} msg 状态信息
 */
export function responseSuccess (data = {}, msg = '成功') {
  return response(data, msg)
}

/**
 * @description 接口请求返回 错误返回
 * @param {Any} data 返回值
 * @param {String} msg 状态信息
 * @param {Number} code 状态码
 */
export function responseError (data = {}, msg = '请求失败', code = 500) {
  return response(data, msg, code)
}

/**
 * @description 记录和显示错误
 * @param {Error} error 错误对象
 */
export function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

export class CreateMessage {
  constructor () {
    this.messList = []
  }

  error (text) {
    const index = this.messList.indexOf(text)
    if (index > -1) return
    this.messList.push(text)
    Message.error({
      message: text,
      onClose: () => {
        this.messList.splice(index, 1)
      }
    })
  }
}

/**
 * @description 创建一个错误
 * @param {String} msg 错误信息
 */
export function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

const apis = {
  api_key: 't@0A0KGCNaoEZ&wYjn0hbLRwmDj2IgUa',
  aes_key: 'l49ij@Dz0z3X$Gza',
  aes_iv: 'FdO!$8M4bbpTmzxw'
}

/**
 * 加密对象
 */
export function aes_encryptObject (obj) {
  var encryptStr = JSON.stringify(obj)
  encryptStr = aes_encrypt(encryptStr)
  return {
    rq: encryptStr
  }
}

// 加密
export function aes_encrypt (str) {
  var key = cryptoJs.enc.Utf8.parse(apis.aes_key)
  var iv = cryptoJs.enc.Utf8.parse(apis.aes_iv)
  var encrypted = cryptoJs.AES.encrypt(str, key, { iv: iv, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 })

  // return (encrypted.toString());
  return encodeURIComponent(encrypted.toString())
}

// 解密
export function aes_decrypt (str) {
  // str = decodeURIComponent(str);
  var key = cryptoJs.enc.Utf8.parse(apis.aes_key)
  var iv = cryptoJs.enc.Utf8.parse(apis.aes_iv)
  var decrypted = cryptoJs.AES.decrypt(str, key, { iv: iv, padding: cryptoJs.pad.Pkcs7 })
  return decrypted.toString(cryptoJs.enc.Utf8)
}

/**
 * 获取RQ并解析,主用于直接获取URL上的rq
 */
export function getrq (rq) {
  let obj = {}
  rq = decodeURIComponent(rq)
  var arr_url = aes_decrypt(rq)
  // if(arr_url.indexOf('&')  == -1  && arr_url.indexOf('=')  == -1){
  if (isJsonString(arr_url)) {
    // {"a":"1","b":"2"}
    obj = JSON.parse(arr_url)
    return obj
  } else {
    // a=1&b=2
    var arr2 = arr_url.split('&')
    for (var i = 0; i < arr2.length; i++) {
      var arr3 = arr2[i].split('=')
      obj[arr3[0]] = arr3[1]
    }
    return obj
  }
}

/**
 *
 * @param {*} str
 */
export function isJsonString (str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {
  }
  return false
}

// 日期格式化
export const dateFmt = function (d, fmt) {
  var o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
