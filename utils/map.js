import { MAP_KEY } from '../config/config'
let QQMapWX = require('../libs/qqmap-wx-jssdk.min.js')
export const qqmapsdk = new QQMapWX({
  key: MAP_KEY // 必填
})
