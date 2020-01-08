export default {
  data: {
    noMore: false,
    noMores: {},
    empty: false,
    emptys: {},
    _form: {
      page: 1,
      limit: 10,
      keyword: ''
    },
    forms: {},
    result: [],
    results: {},
    api: '',
    firstLoad: false,
    firstLoads: {}
  },
  methods: {
    // 如果是多结果才需要执行这个函数
    // handleInitLoad (arr) {
    //   for(let i in arr) {
    //     firstLoads[i] = true
    //   }
    // },
    handleNew (e) {
      let key = ''
      if (e instanceof Object) {
        key = e.currentTarget.dataset.key
      } else {
        key = e
      }
      // console.log(key)
      // let key = e.currentTarget.dataset.key
      let options = this.data.params || {}
      return new Promise((resolve, reject) => {
        if (key) {
          this.setData({
            [`emptys.${key}`]: false,
            [`noMores.${key}`]: false,
            [`forms.${key}`]: {page: 1, limit: 10, ...options}
          })
          // this.$set(this.forms, key, {page: 1, limit: 10, ...options})
          this[this.data.api](this.data.forms[key]).then(data => {
            if (!this.data.firstLoads[key]) {
              this.setData({
                [`firstLoads.${key}`]: true
              })
            }

            if (data.data.length < this.data.forms[key].limit) {
              if (data.data.length === 0) {
                this.setData({
                  [`results.${key}`]: [],
                  [`emptys.${key}`]: true,
                })
              }
              this.setData({
                [`noMores.${key}`]: true
              })
            } else {
              this.setData({
                [`noMores.${key}`]: false
              })
            }
            this.setData({
              [`results.${key}`]: data.data
            })
            resolve(data)
          }).catch(data => {
            this.setData({
              [`emptys.${key}`]: true,
              [`results.${key}`]: []
            })
            reject(data)
          })
        } else {
          this.setData({
            empty: false,
            noMore: false,
            _form: {page: 1, limit: 10, ...options}
          })
          this[this.data.api](this.data._form).then(data => {
            if (!this.data.firstLoad) {
              this.setData({
                firstLoad: true
              })
            }
            if (data.data.length < this.data._form.limit) {
              if (data.data.length === 0) {
                this.setData({
                  empty: true,
                  result: []
                })
              }
              this.setData({
                noMore: true
              })
            } else {
              this.setData({
                noMore: false
              })
            }
            this.setData({
              result: data.data
            })
            resolve(data)
          }).catch(data => {
            this.setData({
              empty: true,
              result: [],
            })
            reject(data)
          })
        }
      })
    },
    handleMore (e) {
      let key = e.currentTarget.dataset.key
      return new Promise((resolve, reject) => {
        if (key) {
          if (this.data.noMores[key] || !this.data.firstLoads[key]) {
            return false
          }
          this.data.forms[key].page++
          this[this.data.api](this.data.forms[key]).then(data => {
            if (data.data.length < this.data.forms[key].limit) {
              this.setData({
                [`noMores.${key}`]: true
              })
            } else {
              this.setData({
                [`noMores.${key}`]: false
              })
            }
            this.setData({
              [`results.${key}`]: [...this.data.results[key], ...data.data]
            })
            resolve(data)
          }).catch(data => {
            this.setData({
              [`noMores.${key}`]: true
            })
            reject(data)
          })
        } else {
          if (this.data.noMore || !this.data.firstLoad) {
            return false
          }
          this.data._form.page++
          this[this.data.api](this.data._form).then(data => {
            if (data.data.length < this.data._form.limit) {
              this.setData({
                noMore: true,
                result: [...this.data.result, ...data.data]
              })
            }
            resolve(data)
          }).catch((data) => {
            this.setData({
              noMore: true
            })
            reject(data)
          })
        }
      })
    }
  }
}
