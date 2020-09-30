// pages/goods_list/index.js
import { request } from "../../request/index"
/* 
1 用户上滑页面 滚动条触底 开始加载下一页
  1 找到滚动条触底事件
  2 判断还有没有下一页数据
    1 获取到总页数 只有总条数
      总页数 = Math.ceil(总条数 / 页容量 pagesize)
    2 获取当前的页码
    3 判断当前页面是否大于等于总页数
      表示没有下一页数据
  3 假如没有下一页数据 弹出提示
  4 加入还有下一页数据 加载下一页数据 
    1 当前页码++
    2 重新发送请求
    3 数据请求回来 要对data中的数组进行拼接 而不是重新赋值
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项  
  2 重置数据 数组
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭等待效果
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    // 商品列表数据
    goodsList: []

  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  handleTabsItemChange(e) {
    console.log(e);
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v, i) => {
      i===index?v.isActive=true:v.isActive=false
    });
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const result = await request({url: "/goods/search", data: this.QueryParams});
    // console.log(result);
    // 获取总条数
    const total = result.data.message.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    let {goods} = result.data.message;
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...goods]
    })

    //关闭下拉刷新的窗口  如果没有调用下拉刷新的窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
    // wx.hideLoading();
  },
  // 页面上滑 滚动条触底事件
  onReachBottom: function() {
    console.log("onReachBottom");
    // 判断还有没有下一页
    if(this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据',
      });
        
    } else {
      // 有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh: function() {
    // wx.showLoading({
    //   title: "加载中"
    // });
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 重新发送请求
    this.getGoodsList();
  }
})