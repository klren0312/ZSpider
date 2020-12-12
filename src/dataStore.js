import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app, remote } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app

const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

// =========================== 全局存储 =================================
const globalAdapter = new FileSync(path.join(STORE_PATH, '/global.json'))

const globalDb = Datastore(globalAdapter)
globalDb._.mixin(LodashId)
console.log('globalDb init', STORE_PATH)

// 存放规则配置
if (!globalDb.has('apps').value()) {
  globalDb.set('apps', []).write()
}
// 存放chrome路径
if (!globalDb.has('chromePath').value()) {
  globalDb.set('chromePath', []).write()
}
// 存放是否弹出安装chrome提示
if (!globalDb.has('hasTips').value()) {
  globalDb.set('hasTips', false).write()
}
// 存放是mac地址
if (!globalDb.has('mac').value()) {
  globalDb.set('mac', '').write()
}

// =========================== 规则存储 =================================
const ruleAdapter = new FileSync(path.join(STORE_PATH, '/rules.json'))

const ruleDb = Datastore(ruleAdapter)
ruleDb._.mixin(LodashId)
console.log('ruleDb init', STORE_PATH)
// 存放规则配置
if (!ruleDb.has('config').value()) {
  ruleDb.set('config', {}).write()
}
// 存放内容页地址
if (!ruleDb.has('contentUrls').value()) {
  ruleDb.set('contentUrls', {}).write()
}
// 存放发布配置
if (!ruleDb.has('publishConfig').value()) {
  ruleDb.set('publishConfig', []).write()
}

// =========================== 数据存储 =================================
const dataAdapter = new FileSync(path.join(STORE_PATH, '/datas.json'))

const dataDb = Datastore(dataAdapter)
dataDb._.mixin(LodashId)
console.log('dataDb init', STORE_PATH)

if (!dataDb.has('data').value()) {
  dataDb.set('data', []).write()
}

export { dataDb, ruleDb, globalDb }
