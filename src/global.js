/**
 * @file 全局能力的配置与获取
 * 文档地址：https://doc.quickapp.cn/tutorial/framework/optimization-skills.html#%E4%BD%BF%E7%94%A8-globaljs
 */

function getGlobalRef() {
  return Object.getPrototypeOf(global) || global
}

const quickappGlobal = getGlobalRef()

/**
 * 设置全局(被APP与Page共享)数据；
 * @param key {string}
 * @param val {*}
 */
function setGlobalData(key, val) {
  quickappGlobal[key] = val
}

/**
 * 获取全局(被APP与Page共享)数据；
 * @param key {string}
 * @return {*}
 */
function getGlobalData(key) {
  return quickappGlobal[key]
}

import storage from '@system.storage'
import prompt from '@system.prompt'

// 获取存储在storage中的数据
async function getStorageData(key) {
  const data = await storage.get({ key })
  console.log('get storage data', key, data)
  return data.data
}
// 设置浏览器无痕模式
async function setBrowserMode() {
  let mode = await getStorageData('MODE')
  storage.set({
    key: 'MODE',
    value: mode === 'open' ? 'close' : 'open',
    success: () => {
      prompt.showToast({
        message: mode === 'open' ? '已关闭无痕模式' : '已开启无痕模式',
      })
    },
  })
}
// 设置浏览器小说模式
async function setBookMode() {
  let mode = await getStorageData('BOOK')
  storage.set({
    key: 'BOOK',
    value: mode === 'open' ? 'close' : 'open',
    success: () => {
      prompt.showToast({
        message: mode === 'open' ? '已关闭小说模式' : '已开启小说模式',
      })
    },
  })
}
// 设置历史记录数据
async function setHistoryStorageData(data) {
  let mode = await getStorageData('MODE')
  if (mode === 'open') return
  let history = (await getStorageData('HISTORY')) || []
  if (typeof history === 'string') {
    history = JSON.parse(history)
  }
  history.push(data)
  storage.set({
    key: 'HISTORY',
    value: JSON.stringify(history),
  })
}

// 设置收藏书签记录数据
async function setFavorStorageData(data) {
  let favor = (await getStorageData('FAVORITE')) || []
  if (typeof favor === 'string') {
    favor = JSON.parse(favor)
  }
  favor.push(data)
  storage.set({
    key: 'FAVORITE',
    value: JSON.stringify(favor),
    success: () => {
      prompt.showToast({
        message: '收藏书签成功',
      })
    },
  })
}

// 清除存储的数据
function clearStorageData() {
  storage.clear({
    success: function (data) {
      prompt.showToast({
        message: '清除成功',
      })
    },
    fail: function (data, code) {
      console.log(`handling fail, code = ${code}`)
    },
  })
}

// 默认定义在全局
setGlobalData('setGlobalData', setGlobalData)
setGlobalData('getGlobalData', getGlobalData)
setGlobalData('getStorageData', getStorageData)
setGlobalData('setBrowserMode', setBrowserMode)
setGlobalData('setBookMode', setBookMode)
setGlobalData('setHistoryStorageData', setHistoryStorageData)
setGlobalData('setFavorStorageData', setFavorStorageData)
setGlobalData('clearStorageData', clearStorageData)

export {
  setGlobalData,
  getGlobalData,
  getStorageData,
  setBrowserMode,
  setBookMode,
  setHistoryStorageData,
  setFavorStorageData,
  clearStorageData,
}
