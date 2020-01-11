//index.js
/// 框架
import { SPage } from '../../utils/spage'
import { promisify } from '../../utils/index'
import { decodeData } from '../../api/index'
const Api = new Proxy(wx, {
  get(target, key) {
    if (typeof target[key] == 'function') {
      return promisify(target[key])
    } else {
      return target[key]
    }
  },
  set(target, key, value) {
    console.error('不能设置框架内部API')
  },
  deleteProperty(target, key) {
    console.error('不能删除框架内部API')
  }
})

const $Modal = (content, status) => {
  Api.showModal({
    title: status == 1 ? '成功结果' : '失败结果',
    content: JSON.stringify(content) || '',
  })
}

const modalFunc = (func) => {
  func.then(data => {
    $Modal(data, 1)
  }).catch(e=> {
    $Modal(e, 0)
  })
}


SPage({
  data: {
    list: [
      
      {
        title: '所有权限',
        func (obj) {
          Api.openSetting({})
        }
      },
      {
        title: '拉取h5领取红包封面页',
        func (obj) {
          modalFunc(Api.showRedPackage({
            url: 'https://www.baidu.com'
          }))
        }
      },
      {
        title: '微信运动',
        func (obj) {
          Api.getWeRunData().then(({encryptedData, iv}) => {
            decodeData({encryptedData, iv}).then(data => {
              $Modal(data, 1)
            })
          }).catch(e => {
            $Modal(e)
          })
        }
      },
      {
        title: '客户端小程序订阅消息界面',
        func (obj) {
          Api.requestSubscribeMessage({
            tmplIds: ['QzSSusBVjjs-5PZPvoRY6r5JGqcOq5IiKUuuv8NPlp0']
          }).then(data => {
            $Modal(data, 1)
          }).catch(data => {
            $Modal(data, 0)
          })
        }
      },
      {
        title: '拉取h5领取红包封面页',
        func (obj) {
          Api.showRedPackage({
            url: 'https://www.baidu.com'
          }).then(data => {
            $Modal(data, 1)
          }).catch(data => {
            $Modal(data, 0)
          })
        }
      }
    ]
  },
  bindfunc(e) {
    let index = e.currentTarget.dataset.index
    this.data.list[index]['func'](this)
  },
  onLoad () {
  }
})