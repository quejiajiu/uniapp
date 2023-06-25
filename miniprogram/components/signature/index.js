// @ts-ignore
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //高度百分比
    h: {
      type: Number,
      value: 0.4,
    },
    //  填充描述文字
    fillText: {
      type: String,
      value: "请使用正楷",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    canvas: "",
    ctx: "",
    pr: 0,
    width: 0,
    height: 0,
    first: true,
  },
  attached: function () {
    this.getSystemInfo();
    this.createCanvas();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    start(e) {
      if (this.data.first) {
        this.clearClick();
        this.setData({
          first: false
        });
      }
      // 开始创建一个路径，如果不调用该方法，最后无法清除画布
      this.data.ctx.beginPath();
      // 把路径移动到画布中的指定点，不创建线条。用 stroke 方法来画线条
      this.data.ctx.moveTo(e.changedTouches[0].x, e.changedTouches[0].y);
    },
    move(e) {
      // 增加一个新点，然后创建一条从上次指定点到目标点的线。用 stroke 方法来画线条
      this.data.ctx.lineTo(e.changedTouches[0].x, e.changedTouches[0].y);
      this.data.ctx.stroke();
    },
    error: function (e) {
      console.log("画布触摸错误" + e);
    },
    /**
     * 初始化
     */
    createCanvas() {
      const pr = this.data.pr; // 像素比
      const query = this.createSelectorQuery();
      query
        .select("#signCanvas")
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          if (!res[0]) return;
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");
          canvas.width = this.data.width * pr; // 画布宽度
          canvas.height = this.data.height * pr; // 画布高度
          ctx.scale(pr, pr); // 缩放比
          ctx.lineGap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = 4; // 字体粗细
          ctx.font = "40px Arial"; // 字体大小，
          ctx.fillStyle = "#ecf0ef"; // 填充颜色
          ctx.fillText(
            this.data.fillText,
            this.data.width / 2 - 100,
            this.data.height / 2
          );
          this.setData({
            ctx,
            canvas
          });
        });
    },
    // 获取系统信息,宽，高，像素比
    getSystemInfo() {
      let _that = this;
      wx.getSystemInfo({
        success(res) {
          _that.setData({
            pr: res.pixelRatio,
            width: res.windowWidth,
            height: res.windowHeight * _that.data.h,
          });
        },
      });
    },
    //重签
    clearClick: function () {
      //清除画布
      this.data.first = true;
      this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);
    },
    //保存图片
    saveClick: function (cb) {
      if (this.data.first) {
        wx.showToast({
          title: "签名数据为空!",
          icon: "none",
        });
        return false;
      }
      //  获取临时文件路径
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.data.width,
        height: this.data.height,
        destWidth: this.data.width * this.data.pr,
        destHeight: this.data.height * this.data.pr,
        canvasId: "canvas",
        canvas: this.data.canvas,
        fileType: "png",
        success: (res) => {
          // 文件转base64
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePath,
            encoding: "base64",
            success: (val) => {
              cb && cb(res, val);
              //  转换成功派发事件
              // this.triggerEvent("success", val.data);
            },
          });
        },
      });
    },
  },
});