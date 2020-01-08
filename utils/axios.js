// import cookie from './cookie.js'
import { REQUEST_API, SIGNATURE_NAME, SESSION_NAME, APP_SYSTEM_KEY, APP_SYSTEM_VALUE } from '../config/config'
import { $Toast } from '../components/base/index.js'
import cookie from './cookie'

/**
 * 
 * API正常输出
 * {
 *  status: 1,
 *  data: {}, // {}/[]/''/1 (任何东西)
 *  msg: 'sccuess',
 *  code: 200
 * }
 * 
 *  API异常输出
 * {
 *  status: 0,
 *  data: {},
 *  errRedirect: '/pages/home/index', /// 重定向页面
 *  msg: '请求异常',
 *  code: 400 // 400/404 ...
 * }
 * 
 */
let timer = null
export default (params = {}) => {
  let BASE_URL = REQUEST_API
  let {
    url,
    data,
    header,
    method,
    dataType,
    responseType,

    // 自定义
    custom, /* 手动控制数据返回 */
    all,
    loading, /* 显示转圈 */
    absolute, /* 绝对路径 */
    upload,
    name,
    error,
    filePath
  } = params
  if (!header) {
    header = {}
  }

  // 存在签名，带上头
  let sign = cookie.get(SIGNATURE_NAME)
  let session = cookie.get(SESSION_NAME)
  if (sign) {
    header[SIGNATURE_NAME] = sign
  }
  if (session) {
    header[SESSION_NAME] = session
  }
  /// app环境
  header[APP_SYSTEM_KEY] = APP_SYSTEM_VALUE

  
  if (loading) {
    $Toast({
      content: '正在加载...',
      type: 'loading'
    })
  }

  // 预留session为位
  if (method && method.toLowerCase() === 'POST') {
    header['Content-Type'] = 'application/json, text/plain, */*'
  }

  if (!upload) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: absolute ? url : BASE_URL + url,
        data,
        dataType,
        responseType,
        header: header,
        method: method || 'GET',
        success: (data) => {
          if (custom) {
            resolve(data)
            return false
          }
          if (!all) {
            if (data.data.status === 1) {
              data.data.data !== undefined ? resolve(data.data.data) : resolve(data.data)
            } else {
              console.log('请求网址:' + (absolute ? url : BASE_URL + url))
              console.warn(data.data)
              if (error !== false) {
                try {
                  $Toast({
                    type: 'error',
                    content: data.data.msg || '异常信息！'
                  })
                } catch (e) {
                  console.warn('toast组件不能加载')
                }
              }
              if (data.data.errRedirect) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                  wx.navigateTo({
                    url: data.data.errRedirect
                  })
                }, 1000)
              }
              reject(data.data)
            }
          } else {
            if (data.data.status == 1) {
              resolve(data)
            } else {
              if (data.data.msg) {
                $Toast({
                  content: data.data.msg
                })
              }
              reject(data)
            }
          }
        },
        failed: (res) => {
          console.warn(res)
          try {
            $Toast({
              type: 'error',
              content: '网络异常！'
            })
          } catch (e) {
            console.warn('toast组件不能加载')
          }
          reject(res)
        },
        complete: () => {
          if (loading) {
            $Toast.hide()
          }
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: absolute ? url : BASE_URL + url,
        filePath,
        name: name || 'file',
        formData: data || {},
        header,
        success: (data) => {
          if (custom) {
            resolve(data)
            return false
          }
          if (!all) {
            try {
              data = JSON.parse(data.data)
            } catch (e) {
              console.warn('返回数据不是json')
              try {
                $Toast({
                  type: 'error',
                  content: '后台异常！'
                })
              } catch (e) {
                console.warn('toast组件不能加载')
              }
            }
            // console.log(data)
            if (data.status === 1) {
              // console.log(data)
              return data.data !== undefined ? resolve(data.data) : resolve(data)
            } else {
              console.warn(data)
              try {
                if (error !== false) {
                  $Toast({
                    type: 'error',
                    content: data.msg || '异常信息！'
                  })
                }
              } catch (e) {
                console.warn('toast组件不能加载')
              }
              reject(data)
            }
          } else {
            resolve(data)
          }
        },
        failed: (res) => {
          reject(res)
        },
        complete: () => {
          if (loading) {
            $Toast.hide()
          }
        }
      })
    })
  }
}
