import { baseUrl } from '../api/http';
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}
export const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return (
    [year, month, day].map(formatNumber).join('-')
  )
}
const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
export const getUserInfo = (success?: Function, fail?: Function) => {
  // 开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  // getUserInfo
  wx.getUserProfile({
    desc: '获取你的昵称、头像、地区及性别',
    success: res => {
      console.log(res)
      wx.setStorage({
        key: "userInfo",
        data: res.userInfo
      })
      success && success(res.userInfo)
    },
    fail: res => {
      console.log(res)
      //拒绝授权
      fail && fail(res)
      wx.showToast({
        title: '您拒绝了授权,不能正常使用小程序',
        icon: 'error',
        duration: 2000
      });
      return;
    }
  });
}
export const uploadFile = (file: any, name?: string) => {
  // fileType 0：其他，1：身份证，2：驾驶证
  let token = wx.getStorageSync('token');
  return new Promise((resolve) => {
    wx.uploadFile({
      url: `${baseUrl}/file/upload`,
      filePath: file.url,
      name: name || 'file',
      formData: { 'fileType': file.fileType },
      header: { token },
      success(res) {
        if (res && res.statusCode === 200) {
          let result: any = {};
          try {
            result = JSON.parse(res.data)
          } catch (error) {
            throw Error('上传异常');
          }
          resolve(result);
        } else {
          resolve({});
        }
      },
      fail() {
        resolve({});
      }
    });
  });
}