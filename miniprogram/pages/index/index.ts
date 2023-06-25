// index.ts
// 获取应用实例
// const app = getApp<IAppOption>()
import { getIsFirstRegister, getIsAdmin, queryCount } from '../../api/login'

Page({
  data: {
    hasRegister: false,
    isAdmin: false,
    isVisitor: false,
    total: 0
  },
  async getIsFirstRegister() {
    let res = await getIsFirstRegister();
    if (res && res.code === 200) {
      this.setData({
        hasRegister: res.data === true
      })
    }
  },
  // 是否是管理员
  async getIsAdmin() {
    let res = await getIsAdmin();
    if (res && res.code === 200) {
      this.setData({
        isAdmin: res.data === true
      })
      wx.setStorageSync('tourist', true);
    }
  },
  // 查询总数
  async queryCount() {
    let res = await queryCount();
    if (res && res.code === 200) {
      this.setData({ total: res.data })
    }
  },
  onLoad() {
    // @ts-ignore
    this.getIsFirstRegister();
    this.getIsAdmin();
    let isVisitor = wx.getStorageSync('isVisitor');
    this.setData({ isVisitor: isVisitor === true });
    if (isVisitor === true) {
      this.queryCount();
    }
  },
  onReady() { },
  toPage(e: any) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    if (index == 2 || index == 3) {
      wx.navigateTo({
        url: '../registerList/index?&from=home&type=' + index,
      })
    } else {
      let _this = this;
      wx.navigateTo({
        url: `../register/index?type=${index}&has=${this.data.hasRegister}`,
        success: function (res) {
          const eventChannel = res.eventChannel
          eventChannel.on('myRegisterStatus', function (data) {
            console.log(data)
            _this.setData({ hasRegister: true })
            let isVisitor = wx.getStorageSync('isVisitor');
            if (isVisitor === true) {
              _this.queryCount();
            }
          })

        }
      })
    }

  }
})
