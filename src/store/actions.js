/* global document, window */

import * as types from './mutation-types'
// 登录用户信息
export const updateUserInfo = ({ commit, rootState }, data) => {
  commit(types.SET_USERINFO, data)
}
// 选择列状态
export const updateTableCloum = ({ commit, rootState }, data) => {
  commit(types.SET_TABLECLOUM, data)
}
export const updateLocalNav = ({ commit, rootState }, data) => {
  // 更新导航标识
  commit(types.SET_LOCALNAV, data)
}
// 以下为测试数据

export const updateCurRole = ({ commit, rootState }, data) => {
  // 更新用户角色
  commit(types.SET_CURROLE, data)
}

export const setLoading = ({ commit, state, rootState }, data) => {
  commit(types.SET_LOADING, data)
}

export const updateDialog = ({ commit, state, rootState }, data) => {
  commit(types.DIALOG_UPDATE, data)
}
