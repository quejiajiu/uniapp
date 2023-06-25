// pages/userAgreement/index.ts
import { getxieyi } from '../../api/index';
Page({
  data: {
    text: ""
  },
  // 获取协议数据
  async getData(type: number) {
    let res = await getxieyi()
    if (res && res.code === 200) {
      let { userNotice, privacyPolicy } = res.data
      this.setData({
        text: type === 1 ? userNotice : privacyPolicy
      })
    }
  },
  onLoad(option: any) {
    console.log(option)
    if (option.type == 1) {
      console.log(option.type)
      this.getData(1);
      wx.setNavigationBarTitle({
        title: '用户协议'
      })
    } else {
      this.getData(2);
      wx.setNavigationBarTitle({
        title: '隐私政策'
      })
    }
  },
})