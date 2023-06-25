// pages/login/index.ts
import { getOpenID } from '../../api/login';

Page({
  data: {
    agree: 1,
    isAgree: false,
  },
  // 勾选同意隐私协议
  checkboxChange(e: any) {
    let val = e.detail.value
    if (val.length > 0) {
      this.setData({
        agree: 2,
        isAgree: true
      })
    } else {
      this.setData({
        agree: 1,
        isAgree: false
      })
    }
  },
  // 司机一键登录
  submit() {
    if (this.data.isAgree) {
      let _this = this;
      // this.onAgree();
      wx.login({
        success(res) {
          _this.getSession(res.code);
        }
      })
    } else {
      wx.showToast({
        title: '请勾选用户协议和隐私政策',
        icon: 'error',
        duration: 2000
      });
    }
  },
  // 接口获取 session_key openid
  async getSession(code: string) {
    wx.showLoading({ title: "登录中…" });
    let res: any = await getOpenID({ code });
    wx.hideLoading();
    console.log(res)
    if (res && res.code === 200) {
      wx.setStorageSync('token', res.data.token);
      wx.setStorageSync('isAdmin', false);
      wx.setStorageSync('isVisitor', false);
      this.onAgree();
    } else {
      wx.showToast({
        title: res.failMsg || '登录失败，请重试',
        icon: 'none'
      })
    }
  },
  // 同意授权用户信息
  onAgree() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 跳转隐私政策页
  toUserServer(e: any) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../userAgreement/index?type=' + index
    })
  },
  toAccountLogin() {
    wx.navigateTo({
      url: '../login/account'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

})