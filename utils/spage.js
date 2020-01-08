import methods from '../mixins/index'
import store from '../store'
import load from '../mixins/load'
// let count = 0 
function SPage (config = {}) {
  // console.log('create a Page, count:' + (count++))
  let data = typeof config['data'] == 'object' ? config['data'] : {}
  delete config['data']
  let page
  page =  Page({
    ...methods,
    ...config,
    data: {
      ...store.state,
      ...data
    },
    onShow() {
      /// 展示的时候绑定本页面为store对象页面
      store.bind(this)
      /// 渲染
      store.render()

      if(typeof config['onShow'] == 'function') {
        config['onShow'].call(this)
      }
    },
    onLoad(options = {}) {
      this.setData({
        options
      })
      if(typeof config['onLoad'] == 'function') {
        config['onLoad'].call(this, options)
      }
    },
  })

  return page;
}
// 与SPage分开，因为这个LPage对数据有一定开销
function LPage(config = {}) {
  // console.log('create a Page, count:' + (count++))
  let data = typeof config['data'] == 'object' ? config['data'] : {}
  delete config['data']
  let page
  page =  Page({
    ...methods,
    ...load.methods,
    ...config,
    data: {
      REQUEST_HOST,
      ...load.data,
      ...store.state,
      ...data
    },
    onShow() {
      /// 展示的时候绑定本页面为store对象页面
      store.bind(this)
      /// 渲染
      store.render()

      if(typeof config['onShow'] == 'function') {
        config['onShow'].call(this)
      }
    },
    onLoad(options = {}) {
      this.setData({
        options
      })
      if(typeof config['onLoad'] == 'function') {
        config['onLoad'].call(this, options)
      }
    },
    onPullDownRefresh() {
      this.handleNew().then(() => {
        wx.stopPullDownRefresh()
      })
    }
  })

  return page;
}


module.exports.SPage = SPage
module.exports.LPage = LPage