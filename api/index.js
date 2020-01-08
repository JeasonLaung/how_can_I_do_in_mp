import axios from '../utils/axios'
import cookie from '../utils/cookie.js'
import { ACTION_RESPONSE, UPLOAD_PATH } from '../config/config'

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

/// 获取orc识别token
export const getOrcToken = () => {
  return new Promise((resolve, reject) => {
    let orc = cookie.get('BAIDU_ORC_TOKEN') || {}
    let now = new Date().getTime()
    if (!orc.expires || orc.expires < now) {
      axios({
        url: '/api/baidu_orc/getToken'
      }).then((data) => {
        cookie.set('BAIDU_ORC_TOKEN', data)
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
