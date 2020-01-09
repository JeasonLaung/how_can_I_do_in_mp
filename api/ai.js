import axios from '../utils/axios'
import { getAiToken } from './index'


export const aiSpeech = (data = {}) => {
  /**
   * @params String format
   * @params Number rate
   * @params Number dev_pid
   * @params Number channel
   * @params String token
   * @params String cuid(baidu_workshop)
   * @params String len
   * @params base64 speech （FILE_CONTENT）
   * @returns Promise
   */
  return new Promise((resolve, reject) => {
    return getAiToken().then((access_token) => {
      return axios({
        method: 'POST',
        url: 'http://vop.baidu.com/server_api',
        absolute: true,
        data: {
          format: 'pcm',
          rate: 16000,
          dev_pid:1536,
          channel:1,
          token: access_token,
          cuid: 'baidu_workshop',
          len: 4096,
          ...data
        }
      }).then(data => {
        resolve(data)
      })
    })
  })
  
  
}