import { $Toast, $Message } from '../components/base/index'
import { action, upload } from '../api/index'

/// 快速输出
const $tell = (e) => {
  console.log(e)
}

/// 快速处理路由
const $go = (e, type = 'navigateTo') => {
  let url
  if (e instanceof Object) {
    url = e.currentTarget.dataset.url
    type = e.currentTarget.dataset.type || 'navigateTo'
  } else {
    url = e
  }
  if (type === 'navigateBack') {
    return new Promise((resolve, reject) => {
      wx.navigateBack({
        delta: url || 1,
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      wx[type]({
        url,
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })
    })
  }
}

/// 快速打开定位
const $openLocation = (e) => {
  let pos = {}
  if (e['currentTarget'] && e['currentTarget'].dataset.location) {
    let location = e.currentTarget.dataset.location.split(',')
    console.log(location)
    pos['latitude'] = Number(location[0])
    pos['longitude'] = Number(location[1])
  } else {
    pos = e
  }
  wx.openLocation(pos)
}

/// 图片展示
const $preview = (current, urls = [], host = '') => {
  if (typeof current == 'object') {
    urls = current.currentTarget.dataset.urls
    current = current.currentTarget.dataset.current
  } else if (typeof current == 'number') {
    current = urls[current]
  }
  if (host) {
    wx.previewImage({
      current: host + current,
      urls: urls.map((img) => host + img)
    })
  } else {
    wx.previewImage({
      current: current,
      urls: urls
    })
  }
}

/// 快速电话
const $phone = (e) => {
  let phone = e
  if (typeof e === 'object') {
    phone = e.currentTarget.dataset.phone
  } else {
    phone = e
  }
  wx.makePhoneCall({
    phoneNumber: String(phone)
  })
}

/// 快速复制
const $copy = (e) => {
  let thing
  if (typeof e === 'object' && e['currentTarget']) {
    thing = e.currentTarget.dataset.copy
  } else {
    thing = e
  }
  wx.setClipboardData({
    data: thing,
    success (res) {
      wx.showToast({
        title: '复制成功'
      })
      // wx.getClipboardData({
      //   success (res) {
      //     console.log(res.data) // data
      //   }
      // })
    },
    fail() {
      wx.showToast({
        title: '复制失败'
      })
    }
  })
}

/// 获取formid
const $collect = (e) => {
  let formId = e.detail.formId
  action(formId)
  let url = e.currentTarget.dataset.url
  if (url) {
    $go(url)
  }
}

/// 快速wx.showModal
const $modal = (obj = {}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      success({confirm}){
        if (confirm) {
          resolve()
        } else {
          reject()
        }
      },
      fail() {
        reject()
      },
      ...obj,
    })
  })
}

/// 快速处理bindinput或直接设置value值
function $input (e) {
  let value
  if (e.detail.value !== undefined) {
    value = e.detail.value
  } else if (e.currentTarget.dataset.value !== undefined) {
    value = e.currentTarget.dataset.value
  } else {
    value = e.detail
  }
  let name = e.currentTarget.dataset.name
  if (e.detail.value !== undefined) {
    value = e.detail.value
    let transform = e.currentTarget.dataset.transform
    if (e.currentTarget.dataset.transform) {
      try {
        this.setData({
          [name]: value[transform]()
        })
      } catch (e) {
        console.log('传入的transform方法不正确，不能进行转换')
      }
      return value[transform]()
    }
  } else {
    value = e.detail
  }
  this.setData({
    [name]: value
  })
}

module.exports = {
  $go,
  $Toast,
  $Message,
  $tell,
  $collect,
  $phone,
  $copy,
  $upload: upload,
  $openLocation,
  $input,
  $preview,
  $modal
}