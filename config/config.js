export const IS_DEBUG = true

export const APP_NAME = '小程序能做什么？'

export const BIRTHDAY = '2020-01-08%00:00:00' /// 2020-01-08 00:00:00

// 请求域
export const REQUEST_HOST = 'https://jeason.xyz/'

/// 公司主页
export const COMPANY_HOME = 'https://jeason.xyz/'

// 地图地址（个人的话要自己重定向到这个url）
export const MAP_HOST = REQUEST_HOST + '/map/' /// 如果是企业的话可以直接加多一个合法域名，因为个人号只能有一个 https://apis.map.qq.com/ws/

// 请求api地址
export const REQUEST_API = REQUEST_HOST

// 配置名称
export const CONFIG_COOKIE_NAME = 'jeason-cookie'

// websocket 地址
export const WEBSOCKET_REQUEST_HOST = "https://jeason.xyz:9501/"
export const WEBSOCKET_HOST = "wss://jeason.xyz:9501/"


// 地图划线样式
export const POLYLINE_STYLE = {
  color: '#3883FA',
  arrowLine: true,
  width: 10
}

// 系统名称（区分安卓/苹果/小程序）键
export const APP_SYSTEM_KEY = 'rental-device-type'

// 系统名称（区分安卓/苹果/小程序）值
export const APP_SYSTEM_VALUE = 'weixin-miniproject'

// 签名名称
export const SIGNATURE_NAME = 'jeason-signature'

// session名称
export const SESSION_NAME = 'jeason-session'

// 文件上传路径
export const UPLOAD_PATH = REQUEST_API + '/api/weixinmp/upload'

// 行为反应,只针对小程序这么无品的行为分析
export const ACTION_RESPONSE = '/api/weixinmp/collect'

// 地图sdk
export const MAP_KEY = 'Z3PBZ-HOA3V-Z6IPR-UKYVH-BBBPK-32B6D'

