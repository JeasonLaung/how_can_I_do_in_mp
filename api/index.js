import axios from '../utils/axios'
import cookie from '../utils/cookie.js'
import { ACTION_RESPONSE, UPLOAD_PATH, SESSION_NAME } from '../config/config'

/// formid保存
export const action = (formId) => {
  if (formId === 'the formId is a mock one') {
    return false
  }
  axios({
    error: false,
    method: 'POST',
    url: ACTION_RESPONSE,
    data: {
      formId
    }
  })
}

/// 上传文件同意接口
export const upload = (data = {}) => {
  let { filePath } = data
  delete (data['filePath'])
  return axios({
    url: UPLOAD_PATH,
    absolute: true,
    upload: true,
    filePath,
    all: true,
    name: 'file',
    data
  })
}


/// 反馈投诉
export const report = (data = {}) => {
  return axios({
    url: '/rental_app/action/report',
    data,
    method: 'POST'
  })
}

/// 获取Ai识别token
export const getAiToken = () => {
  return new Promise((resolve, reject) => {
    let orc = cookie.get('BAIDU_AI_TOKEN') || {}
    let now = new Date().getTime()
    if (!orc.expires || orc.expires < now) {
      axios({
        url: '/api/baidu_ai_token'
      }).then((data) => {
        cookie.set('BAIDU_AI_TOKEN', data)
        resolve(data.access_token)
      }).catch(data => {
        reject(data)
        console.log('获取baidu_access_token失败' + data)
      })
    } else {
      resolve(orc.access_token)
    }
  })
}

/**
 * @method GET
 * @param {String} code
 */
export const login = (data = {}) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success({code}) {
        return axios({
          url: '/api/mp_login',
          method: 'GET',
          all: true,
          data: {
            code
          }
        }).then(data => {
          console.log(data)
          cookie.set(SESSION_NAME, data['header'][SESSION_NAME])
          resolve(data)
        }).catch(data => {
          reject(data)
        })
      }
    })
  })

}

/**
 * @method POST
 * @param {String} iv 
 * @param {String} encryptedData 
 */
export const decodeData = (data = {}) => {
  return axios({
    url: '/api/mp_decode',
    method: 'POST',
    data
  })
}
