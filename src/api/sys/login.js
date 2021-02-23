import request from '../service'
import configApi from "../modules/configApi"
import {aes_encryptObject} from ".././tools"

export function getcommonCaptcha() {
    return request({
      url: configApi.commonCaptcha,
      method: 'post',
    })
  }

  export function AccountLogin(data) {
    return request({
      url: configApi.userLogin,
      method: 'post',
      data:aes_encryptObject(data)
    })
  }