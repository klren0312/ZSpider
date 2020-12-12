import { globalDb } from '@/dataStore'
import store from '@/store'
const appCollection = globalDb.get('apps')

/**
 * 获取应用列表
 */
export function getApps () {
  return JSON.parse(JSON.stringify(globalDb.get('apps').value()))
}

/**
 * 通过id获取应用
 * @param {String} id 应用id
 */
export function getAppById (id) {
  return appCollection.find({ id: id }).value()
}

/**
 * 通过id修改应用
 * @param {String} id 应用id
 * @param {Object} app 应用配置
 */
export function editAppById (id, app) {
  return appCollection.find({ id: id }).assign({ ...app }).write()
}

/**
 * 新增应用
 * @param {Object} app 应用配置
 */
export function addApp (app) {
  return appCollection.insert({ ...app }).write()
}

/**
 * 上传应用
 * @param {Object} app 应用配置
 */
export function uploadApp (app) {
  return fetch(`${store.state.ServerUrl}/apps`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      appName: app.appName,
      ruleConfig: app.ruleConfig,
      localId: app.id,
      type: app.type
    })
  }).then(res => res.json())
}

/**
 * 拉取远程应用
 */
export function getRemoteApp () {
  return fetch(`${store.state.ServerUrl}/apps`).then(res => res.json())
}

/**
 * 删除应用
 * @param {String} id 应用id
 */
export function deleteApp (id) {
  return appCollection.remove({ id: id }).write()
}
