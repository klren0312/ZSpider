import { dataDb } from '@/dataStore'
const collection = dataDb.defaults({ data: [] }).get('data')

/**
 * 清空缓存数据
 */
export function clearData() {
  return dataDb.set('data', []).write()
}

/**
 * 获取数据
 */
export function getDatas() {
  return dataDb.get('data').value()
}

/**
 * 添加数据
 * @param {Object} data 数据
 */
export function addData(data) {
  return collection.insert({ ...data }).write()
}
