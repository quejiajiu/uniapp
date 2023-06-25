import {
  baseUrl
} from './http.js'

export const request = function ({
  url,
  data,
  method = 'POST',
  contentType = 'application/json',
  loading = false,
} = {}) {
  let fullUrl = `${baseUrl}${url}`
  let token = wx.getStorageSync('token');
  if (loading) {
    wx.showLoading({
      title: "数据请求中"
    });
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      header: {
        'content-type': contentType, // 默认值
        'token': token,
      },
      success(res) {
        if (loading) {
          wx.hideLoading()
        }
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          // reject(res.data.message)
          resolve({})
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络错误！',
          icon: 'none'
        })
        // reject(res.data?.message)
        resolve({})
      }
    })
  })
}