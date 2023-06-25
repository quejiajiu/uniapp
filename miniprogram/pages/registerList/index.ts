// pages/registerList/index.ts
import { getRegisterList, getTempList } from '../../api/index';
import { driveList } from '../../utils/map';

Page({
  data: {
    driveList: ['全部', ...driveList()],
    list: [],
    loaded: false,
    loading: false,
    refreshing: true,
    scrollTop: <number | null>0.1,
  },
  drive: <null | string>null,
  drivingType: 0,
  current: 1,
  initLoading: true,
  from: '',
  index: 2,
  toDatail(e: any) {
    let id = e.currentTarget.dataset.id;
    let isVisitor = wx.getStorageSync('isVisitor');
    if (this.from === 'home' && isVisitor) {
      wx.navigateTo({
        url: `../virtualList/index?type=3&from=${this.from}&id=${id}`,
      })
    } else {
      wx.navigateTo({
        url: `../register/index?type=3&from=${this.from}&id=${id}`,
      })
    }

  },
  async getList() {
    let params = {
      request: {
        drivingType: this.drive,
        pageType: this.from === 'home' ? 0 : 1,
      },
      pageSize: 10,
      pageNum: this.current
    }
    let res;

    if (this.index == 3) {
      res = await getTempList(params);
    } else {
      res = await getRegisterList(params);
    }
    // wx.stopPullDownRefresh();
    this.setData({ refreshing: false })
    if (this.initLoading) {
      this.initLoading = false
      wx.hideLoading()
    }
    if (res && res.code === 200) {
      let list = this.data.list;
      if (this.current > 1) {
        list = list.concat(res.data.itemList)
      } else {
        list = res.data.itemList
      }
      if (this.current === 1) {
        // 如果加载第一页数据，列表回到顶部，在更新后执行
        wx.nextTick(() => {
          this.setData({ scrollTop: 0.1 })
        })
      }
      this.setData({
        list: list,
        loading: false,
        loaded: list.length >= res.data.totalCount
      })
    } else {
      this.setData({
        loading: false,
        loaded: false
      })
    }
  },
  // 驾驶证选择
  driveOnChange(e: any) {
    console.log(e.detail.value)
    let index = e.detail.value;
    this.current = 1;
    this.drive = index == 0 ? null : this.data.driveList[index]
    this.initLoading = true;
    wx.showLoading({ title: '加载中' });
    this.getList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    let { from, type } = option;
    this.from = from;
    this.index = type;
    wx.showLoading({ title: '加载中' });
    this.getList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh() {
  // 下拉刷新
  downRefresh() {
    this.current = 1;
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom() {
  // 上拉加载
  onReachLoad() {
    if (!this.data.loading && !this.data.loaded) {
      this.setData({
        loading: true, //加载中
        loaded: false //是否加载完所有数据
      });
      this.current++
      this.getList();
    }
  },
})