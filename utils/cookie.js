import { CONFIG_COOKIE_NAME } from "../config/config"

export default {
  set(name, value) {
    return wx.setStorageSync(name, value)
  },
  get(name) {
    return wx.getStorageSync(name)
  },
  clear() {
    return wx.clearStorageSync()
  },
  remove(name) {
    return wx.removeStorageSync(name)
  },
  setConfig(name, value) {
    let config = this.get(CONFIG_COOKIE_NAME) || {}
    config[name] = value
    return wx.setStorageSync(CONFIG_COOKIE_NAME, config)
  },
  getConfig(name) {
    let config = wx.getStorageSync(CONFIG_COOKIE_NAME)
    return config && config[name] ? config[name] : ''
  }
}
