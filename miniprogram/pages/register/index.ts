// pages/register/index.ts
import { formatDate, uploadFile } from '../../utils/util';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { register, getUserDatil } from '../../api/index';
import { driveList } from '../../utils/map';
let nowDate = formatDate(new Date()), minDate = formatDate(new Date(`${new Date().getFullYear() - 50}`)),
  maxDate = formatDate(new Date(`${new Date().getFullYear() + 60}`));
Page({
  driverId: null,
  loading: false,
  editType: 0,
  data: {
    sexList: ['男', '女'],
    driveList: driveList(),
    username: "",
    sex: <string | number>"",
    idcard: "",
    region: [] as any,
    area: [] as any,
    phone: "",
    drive: <string | number>"",
    driveId: "",
    driveAge: "",
    driveCount: "",
    qualification: "",
    date1: "",
    date2: "",
    date3: "",
    fileList1: [] as any,
    fileList2: [] as any,
    fileList3: [] as any,
    fileList4: [] as any,
    fileList5: [] as any,
    signUrl: "../../images/sign.png",
    dateIndex: "1",
    show: false,
    nowDate: nowDate,
    minDate: minDate,
    maxDate: maxDate,
    hideSignEm: false,
    readonly: false,
    maxSize: 2560000,
  },
  // 性别选择
  sexOnChange(e: any) {
    this.setData({
      sex: e.detail.value
    })
  },
  // 贯籍选择
  regionOnChange(e: any) {
    this.setData({
      region: e.detail.value
    })
  },
  // 地区选择
  areaOnChange(e: any) {
    this.setData({
      area: e.detail.value
    })
  },
  // 驾驶证选择
  driveOnChange(e: any) {
    this.setData({
      drive: e.detail.value
    })
  },
  // 图片选择
  afterRead(event: any) {
    let index = event.currentTarget.dataset.img;
    let _this = this;
    const { file } = event.detail;
    // this.setData({ ['fileList' + index]: [file] });
    wx.compressImage({
      src: file.url, // 图片路径
      quality: 80, // 压缩质量
      success(e) {
        if (e.errMsg === 'compressImage:ok' && e.tempFilePath) {
          let fileType = 0;
          if (index == 1) {
            fileType = 1;// 身份证正面 可OCR识别
          } else if (index == 3) {
            fileType = 2;// 驾驶证正面 可OCR识别
          }
          let params = { url: e.tempFilePath, fileType };
          _this.imageUpload(params, index, fileType);
        }
      }
    })
  },
  // 图片上传
  async imageUpload(file: any, index: number, ocr: number) {
    wx.showLoading({ title: '上传中…' });
    let res: any = await uploadFile(file);
    wx.hideLoading();
    if (res && res.code === 200) {
      if (ocr > 0) {
        this.setOCR(res.data)
        this.setData({
          ['fileList' + index]: [{ url: res.data.imageUrl }]
        });
      } else {
        this.setData({
          ['fileList' + index]: [{ url: res.data }]
        });
      }

    } else {
      Toast.fail(res.failMsg || '上传失败')
    }
  },
  // OCR回显,数据填充
  setOCR(data: any) {
    if (data) {
      let type = data.type;// 正面或背面, Front / Back;
      if (type === "Back") return;
      let setObj = new Map();
      setObj.set('username', data.name); // 姓名
      setObj.set('idcard', data.idCard); // 身份证号
      setObj.set('qualification', data.idCard); // 货运资格证号
      setObj.set('drive', data.drivingType);  // 驾照类型
      setObj.set('date1', data.firstIssueDate);  // 领证日期
      setObj.set('date2', data.validStartDate);  // 有效初始日期
      setObj.set('date3', data.validEndDate);  // 有效到期日期
      setObj.set('driveId', data.drivingLicenseNumber);  // 驾驶证号
      if (data.gender) {
        let _sex = this.data.sexList.indexOf(data.gender);
        if (_sex !== -1) {
          setObj.set('sex', _sex + ''); // 性别
        }
      }
      if (data.drivingType) {
        let _sex = this.data.driveList.indexOf(data.drivingType);
        if (_sex !== -1) {
          setObj.set('drive', _sex + ''); // 驾照类型
        }
      }
      if (data.addr) {
        let reg = /.+?(省|市|自治区|自治州|行政区|盟|旗|县|区)/g // 省市区的正则
        const area = data.addr.match(reg) // 分割省市区
        if (area) {
          setObj.set('region', area); // 籍贯
        }
      }

      let setVal = <any>{};
      let has = false;
      // 遍历属性，有则取出来赋值
      for (let [key, val] of setObj) {
        if (val !== null && val !== undefined) {
          setVal[key] = val;
          if (!has) has = true;
        }
      }
      if (has) {
        let _this = this;
        wx.nextTick(() => {
          _this.setData(setVal);
        })
      }
    }
  },
  // 删除图片
  delectImg(event: any) {
    let index = event.currentTarget.dataset.img;
    this.setData({
      ['fileList' + index]: []
    });
  },
  oversize() {
    Toast.fail('图片大小不能超过2M！');
  },
  // 初次领证 日期选择
  bindDateChange1: function (e: any) {
    this.setData({
      date1: e.detail.value
    })
  },
  // 驾驶证其实有效 日期选择
  bindDateChange2: function (e: any) {
    this.setData({
      date2: e.detail.value
    })
  },
  // 驾驶证有效截 日期选择
  bindDateChange3: function (e: any) {
    this.setData({
      date3: e.detail.value
    })
  },
  // 电子签名
  signName() {
    if (!this.data.readonly) {
      this.setData({
        show: true
      })
    }
  },
  //  保存签名
  save() {
    let signature = this.selectComponent('.signature');
    signature.saveClick(async (url: any) => {
      wx.showLoading({ title: '签名上传中…' });
      let res: any = await uploadFile({ url: url.tempFilePath, fileType: 0 });
      wx.hideLoading();
      if (res && res.code === 200) {
        this.setData({
          hideSignEm: true,
          signUrl: res.data,
          show: false
        })
        this.reset()
      } else {
        Toast.fail(res.failMsg || '签名上传失败')
      }
    })
  },
  //  重置
  reset() {
    let signature = this.selectComponent('.signature');
    signature.clearClick()
  },
  // 关闭签名弹窗
  onClose() {
    this.reset()
    this.setData({ show: false })
  },
  // 提交验证
  onSubmit() {
    if (this.loading) return;
    if (this.data.username === '') {
      Toast.fail('请先输入姓名');
    } else if (this.data.username.length < 2) {
      Toast.fail('姓名最少输入2位');
    } else if (this.data.sex === '') {
      Toast.fail('请选择性别');
    } else if (this.data.idcard === '') {
      Toast.fail('请输入身份证号');
    } else if (!/^\d{17}(\d|x)$/i.test(this.data.idcard)) {
      Toast.fail('请输入正确的身份证号');
    } else if (this.data.phone === '') {
      Toast.fail('请输入手机号');
    } else if (!/^\d{11}$/i.test(this.data.phone)) {
      Toast.fail('请输入正确的手机号');
    } else if (!this.data.area.length) {
      Toast.fail('请选择所在区域');
    } else if (!this.data.fileList1.length) {
      Toast.fail('请上传身份证正面');
    } else if (!this.data.fileList2.length) {
      Toast.fail('请上传身份证反面');
    } else if (!this.data.fileList3.length) {
      Toast.fail('请上传驾驶证正面');
    } else if (!this.data.fileList4.length) {
      Toast.fail('请上传驾驶证反面');
    } else if (!this.data.fileList5.length) {
      Toast.fail('请上传货运资格证');
    } else if (this.data.drive === '') {
      Toast.fail('请选择准驾车型');
    } else if (this.data.driveId === '') {
      Toast.fail('请输入驾驶证号');
    } else if (!/^\d{17}(\d|x)$/i.test(this.data.driveId)) {
      Toast.fail('请输入正确的驾驶证号');
    } else if (this.data.driveCount === '') {
      Toast.fail('请输入驾照分数');
    } else if (+this.data.driveCount > 12) {
      Toast.fail('驾照分数不能超过12分');
    } else if (this.data.qualification === '') {
      Toast.fail('请输入货运资格证');
    } else if (!this.data.hideSignEm) {
      Toast.fail('请写入电子签名');
    } else {
      this.registerApi();
    }
  },
  // 提交请求
  async registerApi() {
    const data = this.data;
    let {
      username, sex, idcard, region, area, phone, drive, driveId, driveCount,
      qualification, date1, date2, date3, fileList1, fileList2, fileList3, fileList4, fileList5, signUrl } = data;
    let params: any = {
      name: username,
      gender: this.data.sexList[+sex],
      idCard: idcard,
      hometownProvince: region[0],
      hometownCity: region[1],
      hometownCounty: region[2],
      regionProvince: area[0],
      regionCity: area[1],
      regionCounty: area[2],
      phoneNumber: phone,
      drivingType: this.data.driveList[+drive],
      drivingLicenseNumber: driveId,
      score: driveCount,
      freightCertificate: qualification,
      firstIssueDate: date1,
      validStartDate: date2,
      validEndDate: date3,
      idFrontUrl: fileList1[0].url,
      idBackUrl: fileList2[0].url,
      drivingFrontUrl: fileList3[0].url,
      drivingBackUrl: fileList4[0].url,
      freightCertificateUrl: fileList5[0].url,
      signatureUrl: signUrl,
      editType: this.editType
    }
    if (this.driverId) {
      params.driverId = this.driverId;
    }
    this.loading = true;
    wx.showLoading({ title: "正在提交……" });
    let res = await register(params)
    this.loading = false;
    wx.hideLoading();
    if (res && res.code === 200) {
      Toast.success('提交成功！');
      let _this = this;
      setTimeout(() => {
        wx.navigateBack({
          success() {
            const eventChannel = _this.getOpenerEventChannel()
            eventChannel.emit('myRegisterStatus', { data: 'test' });
          }
        })
        // wx.switchTab({
        //   url: '../index/index',
        // })
      }, 1000)
    } else {
      Toast.fail(res.failMsg || '提交失败！');
    }
  },
  async getData(driverId: string) {
    let id = driverId != '' ? driverId : null;
    let params = { driverId: id }
    let res = await getUserDatil(params);
    if (res && res.data) {
      let data: any = res.data;
      let sex = this.data.sexList.indexOf(data.gender)
      let drive = this.data.driveList.indexOf(data.drivingType)
      this.editType = data.editType
      this.driverId = data.driverId
      this.setData({
        username: data.name,
        sex: sex + '',
        drive: drive + '',
        idcard: data.idCard,
        phone: data.phoneNumber,
        region: [data.hometownProvince, data.hometownCity, data.hometownCounty],
        area: [data.regionProvince, data.regionCity, data.regionCounty],
        driveId: data.drivingLicenseNumber,
        driveAge: data.score,
        driveCount: data.score,
        qualification: data.freightCertificate,
        date1: data.firstIssueDate,
        date2: data.validStartDate,
        date3: data.validEndDate,
        fileList1: [{ url: data.idFrontUrl }],
        fileList2: [{ url: data.idBackUrl }],
        fileList3: [{ url: data.drivingFrontUrl }],
        fileList4: [{ url: data.drivingBackUrl }],
        fileList5: [{ url: data.freightCertificateUrl }],
        signUrl: data.signatureUrl,
        hideSignEm: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    let type = option.type;
    if (type == 3) {
      // 从列表进入（来自首页列表from=home[管理员查看，不可编辑]，来自‘我的’登记列表from=my[可编辑]）
      let from = option.from;
      if (from === 'home') {
        this.setData({ readonly: true })
      }
      // 编辑
      this.driverId = option.id
      this.getData(option.id);
    } else {
      // 帮他登记 1，自己登记 0
      this.editType = type || 0;
      if (option.has == 'true' && type == 0) {
        // 修改本人登记
        this.getData('');
      }
    }
  },
})