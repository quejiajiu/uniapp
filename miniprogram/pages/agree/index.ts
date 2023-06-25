// pages/agree/index.ts
Page({
  data: {
    isLogin: false,
  },
  // 跳过
  toHome() {
    if (this.data.isLogin) {
      wx.switchTab({
        url: '../index/index'
      })
    } else {
      wx.navigateTo({
        url: '../login/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let token = wx.getStorageSync('token')
    if (token) {
      this.setData({ isLogin: true })
    }
  },
})