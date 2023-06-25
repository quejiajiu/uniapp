// pages/virtualList/index.ts
import { getTempDatil } from '../../api/index';

Page({
  data: {
    item: ''
  },
  async getData(driverId: string) {
    let id = driverId != '' ? driverId : null;
    let res = await getTempDatil(id);
    if (res && res.data) {
      this.setData({ item: res.data })
    }
  },
  onLoad(option: any) {
    this.getData(option.id)
  },
})