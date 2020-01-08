import { qqmapsdk } from "./map"

export const Auth  = {
  /// 是否正在展示modal
  errModal: false,
  
  scopes: {
    location: {
      scope: 'scope.userLocation',
      title: '位置信息'
    },
  },

  getLocation(config = {}) {
    let {
      success, 
      fail, 
      complete,
      type,
      isHighAccuracy,
      altitude,
      highAccuracyExpireTime,
      needAddress
    } = config
    let _this = this
    return new Promise((resolve,reject) => {
      wx.getLocation({
        isHighAccuracy,
        highAccuracyExpireTime: highAccuracyExpireTime || 5000,
        altitude,
        type: type || 'gcj02',
        complete,
        success(data) {
          if (needAddress) {
            qqmapsdk.reverseGeocoder({
              location: `${data['latitude']},${data['longitude']}`,
              // 高德的坐标与腾讯坐标一直，牛逼
              success({result}) {
                let _data = {...data, address: result.address, }
                if (success) {
                  success(_data)
                }
                resolve(_data)
              },
              fail(e) {
                console.error(e)
              }
            })
          } else {
            if (success) {
              success(data)
            }
            resolve(data)
          }
         
        },
        fail(e) {
          console.error(e)
          console.log(_this.errModal)
          if (_this.errModal == true) {
            return false
          }
          _this.errModal = true

          /// 没有开启GPS
          if (e.errMsg == "getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF") {
            wx.showModal({
              title: '请确保开启GPS',
              success({confirm}) {
                _this.errModal = false
              }
            })
          }
          if (e.errMsg == "getLocation:fail auth deny") {
            /// 权限获取失败
            _this.auth(_this.scopes.location.scope, _this.scopes.location.title).then(() => {
              _this.getLocation()
              _this.errModal = false
            }).catch(e => {
              _this.errModal = false
              if (fail) {
                fail(e)
              }
              reject(e)
            })
          }
          if (e.errMsg.toLowerCase().indexOf('timeout') > -1) {
            _this.errModal = false

            $Toast({
              content: '获取位置超时'
            })
          }
        }
      })
    })
  },




  /// 调起统一按钮
  auth (type='', title='位置信息') {
    this.errModal == true
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '本页面需要获取您的' + title + '权限',
        success (res) {
          if (res.confirm) {
            wx.openSetting({
              success ({authSetting}) {
                if (authSetting[type]) {
                  resolve(authSetting)
                } else {
                  reject(authSetting)
                }
              },
              fail (res) {
                reject(res)
              }
            })
          } else {
            reject(res)
          }
        }
      })
    })
  }
}