import {
  request
} from './request';

export const login = (params) => request({
  url: '/wechat/adminLogin',
  data: params
});
export const register = (params) => request({
  url: '/driver/edit',
  data: params
});
// 根据id查询司机信息详情
export const getUserDatil = (params) => request({
  url: '/driver/queryById',
  data: params
});
// 根据id查询（虚拟）司机信息详情
export const getTempDatil = (id) => request({
  url: '/driver/temp/queryById?driverId='+id,
  method: 'GET'
});
// 获取司机列表
export const getRegisterList = (params) => request({
  url: '/driver/queryPage',
  data: params
});
// 获取（虚拟）司机列表
export const getTempList = (params) => request({
  url: '/driver/temp/queryPage',
  data: params
});
export const getxieyi = () => request({
  url: '/wechat/getUserNoticeMsg',
  method: 'GET'
});
export const fileUpload = (params) => request({
  url: '/file/upload',
  data: params,
  contentType: 'multipart/form-data'
});