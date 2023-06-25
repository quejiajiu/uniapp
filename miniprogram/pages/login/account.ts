// pages/login/account.ts

import { login } from '../../api/index'
Page({
  data: {
    agree: 1,
    isAgree: false,
    userName: "",
    passWord: ""
  },
  inputChange() { },
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
  async submit() {
    if (this.data.userName === "") {
      wx.showToast({
        title: '账号不能为空',
        icon: 'error'
      });
    } else if (this.data.passWord === "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      });
    } else {
      // 登录
      if (this.data.isAgree) {
        wx.showLoading({ title: '正在登录……' });
        let params = {
          "accountName": this.data.userName,
          "password": this.data.passWord
        };
        let res: any = await login(params);
        wx.hideLoading();
        if (res && res.code === 200) {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('isAdmin', true);
          if (this.data.userName === 'visitor') {
            // 根据账号判断是否为‘游客’
            wx.setStorageSync('isVisitor', true);
          } else {
            wx.setStorageSync('isVisitor', false);
          }
          wx.switchTab({
            url: '../index/index'
          })
        } else {
          wx.showToast({
            title: res.failMsg || '登录失败，请重试',
            icon: 'error'
          });
        }
      } else {
        wx.showToast({
          title: '请选勾选同意用户协议和隐私政策',
          icon: 'error'
        });
      }

    }
  },
  // 跳转隐私政策页
  toUserServer(e: any) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../userAgreement/index?type=' + index
    })
  },
})