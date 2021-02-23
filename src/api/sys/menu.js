import request from '../service'
import configApi from "../modules/configApi"
import {aes_encryptObject} from ".././tools"

export function getmenuSave(data) {
    return request({
        url: configApi.menuSave,
        method: 'post',
        data:aes_encryptObject(data)
    })
}

export function getmenuDelete(id) {
    return request({
        url: configApi.menuDelete,
        method: 'post',
        data:aes_encryptObject(id)
    })
}

