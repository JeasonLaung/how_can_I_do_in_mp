//index.js
/// 框架
import { SPage } from '../../utils/spage'
import { qqmapsdk } from '../../utils/map'

SPage({
  data: {
    groups: [
      {
        title: '位置与地图',
        list: [
          {
            title: '连续定位',
            url: '/pages/location/index'
          }
        ]
      },
      {
        title: 'AI',
        list: [
          {
            title: '语音识别',
            url: '/pages/ai/sound/index'
          },
          {
            title: 'ORC',
            url: '/pages/location/index'
          }
        ]
      }
    ],

    titleIndex: -1
  },
  toggleTitle(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      titleIndex: index == this.data.titleIndex ? -1 : index
    })
  },
  onLoad () {
    qqmapsdk.reverseGeocoder({
      success({result}) {
        console.log(result)
      }
    })
  }
})