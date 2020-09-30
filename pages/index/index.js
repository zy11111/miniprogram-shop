import { request } from '../../request/index'
//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  // 页面开始加载的时候就会触发
  onLoad: function(options) {
    // var that = this;  //onLoad的当前对象
    // 1 发送异步请求获取轮播图数据  优化可以通过es6的Promise
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success (res) {
    //     console.log(res.data);
    //     that.setData({
    //       swiperList: res.data.message
    //     })
    //   }
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  async getSwiperList() {
    // request({ url: "/home/swiperdata" })
    // .then(result => {
    //   this.setData({
    //     swiperList: result.data.message
    //   })
    // })
    const result = await request({url: "/home/swiperdata"});
    this.setData({
      swiperList: result.data.message
    })
  },
  // 获取分类导航数据
  async getCateList() {
    // request({ url: "/home/catitems" })
    // .then(result => {
    //   console.log(result)
    //   this.setData({
    //     catesList: result.data.message
    //   })
    // })
    const result = await request({url: "/home/catitems"});
    console.log(result)
    this.setData({
      catesList: result.data.message
    })
  },
  // 获取楼层数据
  async getFloorList() {
    // request({url: "/home/floordata"})
    // .then(result => {
    //   console.log(result);
    //   this.setData({
    //     floorList: result.data.message
    //   })
    // })
    const result = await request({url: "/home/floordata"});
    console.log(result);
    this.setData({
      floorList: result.data.message
    })
  }
});
  