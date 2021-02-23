import request from '../service'
import configApi from "../modules/configApi"
import {aes_encryptObject} from ".././tools"

// 用户添加修改
export function getUserSave(params) {
    return request({
        url: configApi.userSave,
        method: 'post',
        data:aes_encryptObject(params)
    })
}

// 用户划分/移除角色组
export function userRoleEdit(params) {
  return request({
      url: 'v1/user/editRoleUser',
      method: 'post',
      data:aes_encryptObject(params)
  })
}

// 角色添加/修改
export function getRoleSave(params) {
  return request({
      url: 'v1/role/save',
      method: 'post',
      data:aes_encryptObject(params)
  })
}

// 角色删除
export function roleDel(params) {
  return request({
      url: 'v1/role/delete',
      method: 'post',
      data:aes_encryptObject(params)
  })
}


// 角色组赋予权限
export function permissionSave(params) {
  return request({
      url: 'v1/permission/save',
      method: 'post',
      data:aes_encryptObject(params)
  })
}


// 用户状态变更（启用，禁用）
export function userStatus(params) {
  return request({
      url: 'v1/user/status',
      method: 'post',
      data:aes_encryptObject(params)
  })
}

// 清除单个用户api缓存
export function userClear(params) {
  return request({
      url: 'v1/user/clear',
      method: 'post',
      data:aes_encryptObject(params)
  })
}

// 清除角色api缓存
export function roleClear(params) {
  return request({
      url: 'v1/role/clear',
      method: 'post',
      data:aes_encryptObject(params)
  })
}
