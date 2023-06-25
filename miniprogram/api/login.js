import {
  request
} from './request';
// 后台获取用户openid
export const getOpenID = (params) => request({
  url: '/wechat/getToken',
  data: params
});
// 是否已登记
export const getIsFirstRegister = (params) => request({
  url: '/wechat/getIsFirstRegister',
  method: 'GET'
});
// 是否管理员
export const getIsAdmin = (params) => request({
  url: '/wechat/getIsAdmin',
  method: 'GET'
});
// 查询司机总数
export const queryCount = () => request({
  url: '/driver/temp/queryCount',
  method: 'GET'
});