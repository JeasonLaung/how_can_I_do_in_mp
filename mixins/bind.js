/**
 * @param obj Object 传入本页对象this
 * @param arr Array 传入mixins名称
 */
export default function bindMixins(obj, arr) {
  for (let i in arr) {
    let mixin
    try {
      mixin = require('./' + arr[i] + '.js')
    } catch (e) {
      console.error(e)
      // console.error('不存在' + '/mixins/' + arr[i] + '.js，请检查代码是否存在')
      return false
    }
    // console.log(mixin)
    let df = mixin['default']
    obj.setData(df.data)
    for(let m in df.methods) {
      obj[m] = df.methods[m]
    }
  }
}