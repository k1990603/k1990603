import { SET_TABLECLOUM } from '../mutation-types'

const state = {
  showCloum: false // 自定义列名弹窗状态
}

const mutations = {
  [SET_TABLECLOUM] (state, showCloum) {
    state.showCloum = showCloum
  }
}

export default {
  state,
  mutations
}
