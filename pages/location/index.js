//index.js
//获取应用实例
const app = getApp()
// 时间格式化
const date = (str, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (!(str instanceof Date)) {
    str = new Date(str)
  }
  var o = {
    'M+': str.getMonth() + 1, // 月份
    'd+': str.getDate(), // 日
    'h+': str.getHours(), // 小时
    'm+': str.getMinutes(), // 分
    's+': str.getSeconds(), // 秒
    'q+': Math.floor((str.getMonth() + 3) / 3), // 季度
    'S': str.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (str.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

let timer = null
Page({
  data: {
    count: 0,
    count2: 0,
    locationList: []
  },
  openSetting() {
    wx.openSetting()
  },

  openLocation() {
    let _this = this
    wx.startLocationUpdateBackground({
      success() {
        wx.onLocationChange((loc) => {
          console.log(loc)
          _this.data.locationList.push({ ...loc, time: date(new Date()) })
          _this.setData({
            count2: ++_this.data.count2,
            locationList: _this.data.locationList
          })
        })
      }
    })
  },

  closeLocation() {
    let _this = this
    wx.offLocationChange(() => {
      
    })
    wx.stopLocationUpdate({
      success() {
        console.log('关闭成功')
        clearInterval(timer)
        _this.setData({
          count: 0,
          count2: 0,
          locationList: []
        })
      },
      fail(e) {
        console.log('关闭失败' + JSON.stringify(e))

      }
    })
  },

  onLoad() {
    let _this = this
    clearInterval(timer)
    timer = setInterval(() => {
      this.setData({
        count: this.data.count + 1
      })
    },1000)
    wx.getLocation({})

    
  },
  onUnload() {
    clearInterval(timer)
    wx.stopLocationUpdate()
  }
})
