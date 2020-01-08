import Vuex from "./utils/vuex";


export default Vuex.store({
  /// 全局变量建议以首写字母大写为区分，不然会覆盖掉本页同名的变量
  states: {
    userInfo: {},
  },
  mutations: {
    setUserInfo (states, data) {
      states.userInfo = {...states.userInfo, ...data}
    }
  }
})