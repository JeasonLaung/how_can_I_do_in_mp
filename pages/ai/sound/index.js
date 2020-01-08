//index.js
/// 框架
import { SPage } from '../../../utils/spage'
const voiceReciver = wx.getRecorderManager()
const voicePlayer = wx.createInnerAudioContext()

SPage({
  data: {
    voiceTime: 0,
    voice: null,
    showVoice: false,
    playVoiceTime: 0
  },
  bindtouchstart(e) {
    console.log('开始');
    let option = {
      duration: 10000, //录音的时长，之前最大值好像只有1分钟，现在最长可以录音10分钟
      format: 'mp3', //录音的格式，有aac和mp3两种   
    }
    voiceReciver.start(option); //开始录音   这么写的话，之后录音得到的数据，就是你上面写得数据。
    wx.vibrateLong({
      success(e) {
        console.log(e)
      },
      fail(e) {
        console.log(e)
      }
    })
    voiceReciver.onStart(() => {

      console.log('录音开始事件') //这个方法是录音开始事件，你可以写录音开始的时候图片或者页面的变化
    })
  },
  bindtouchend(e) {
    console.log('结束')
    voiceReciver.stop();
    voiceReciver.onStop((res) => {
      console.log(res) //这里是必须写完成事件的，因为最后的文件，就在这里面；
      let time = parseInt(res.duration / 1000);
      this.setData({
        voice: res,
        voiceTime: time,
        showVoice: true,
      })
      // 其中：
      // res.tempFilePath;//是临时的文件地址
      // res.duration;//录音的时长
      // res.fileSize;//文件的大小
    })
  },

  playVoice() {
    let _this = this
    let voice = this.data.voice.tempFilePath;
    voicePlayer.autoplay = true
    voicePlayer.src = voice,
      voicePlayer.onPlay(() => {
        console.log('开始播放')
        let timer = setInterval(() => {
          if (_this.data.playVoiceTime == 1) {
            clearInterval(timer)
            _this.setData({
              playVoiceTime: 0
            })
            return false
          }
          _this.setData({
            playVoiceTime: _this.data.playVoiceTime != 0 ? (_this.data.playVoiceTime - 1) : _this.data.voiceTime
          })
        })
      })
    voicePlayer.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },


  onLoad () {
  }
})