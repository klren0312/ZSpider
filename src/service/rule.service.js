import { ruleDb } from '@/dataStore'

/**
 * 清除规则
 */
export function clearRule () {
  ruleDb.set('config', {}).write()
  ruleDb.set('contentUrls', {}).write()
  ruleDb.set('publishConfig', []).write()
}

/**
 * 获取规则
 * @param {Object} obj 规则
 */
export function addRule (obj) {
  ruleDb.set('config', obj.config).write()
  ruleDb.set('contentUrls', obj.contentUrls).write()
  ruleDb.set('publishConfig', obj.publishConfig).write()
}

/**
 * 获取config
 */
export function getConfig () {
  return ruleDb.get('config').value()
}

/**
 * 获取内容页链接
 */
export function getContentUrls () {
  return ruleDb.get('contentUrls').value()
}

/**
 * 存储内容页链接
 */
export function setContentUrls (urls) {
  return ruleDb.set('contentUrls', urls).write()
}

const publishCollection = ruleDb.get('publishConfig')
/**
 * 获取发布配置
 */
export function getPublishConfig () {
  return ruleDb.get('publishConfig').value()
}

/**
 * 添加发布配置
 * @param {Object} obj 发布配置
 */
export function addPublish (obj) {
  return publishCollection.insert({ ...obj }).write()
}

/**
 * 修改指定发布配置
 * @param {String} id 发布id
 * @param {Object} obj 发布配置
 */
export function editPublishById (id, obj) {
  return publishCollection.find({ id: id }).assign({ ...obj }).write()
}

/**
 * 删除指定发布配置
 * @param {String} id 发布id
 */
export function deletePublish (id) {
  return publishCollection.remove({ id: id }).write()
}
