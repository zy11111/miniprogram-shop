// pages/search/index.js
/* 
1 输入框绑定事件 input事件
  1 获取到输入框的值
  2 合法性判断
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖（防止抖动） 定时器
  0 防抖 一般 输入框中 防止重复输入 重新发送请求
  1 节流 一般是用在页面下拉或上拉
  2 定义全局的定时器
*/
import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false
  },
  TimeId: -1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 输入框绑定事件
  handleInput(e) {
    console.log(e);
    // 获取输入框的值
    const {value} = e.detail;
    // 合法性验证
    if(!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false,
        inpValue: ""
      })
      // 值不合法
      return;
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      // 准备发送请求获取数据
      this.qsearch(value);
    }, 1000);
  },
  // 发送请求获取搜索建议的数据
  async qsearch(query) {
    const res = await request({url: "/goods/qsearch", data: {query}});
    console.log(res);
    this.setData({
      goods: res.data.message
    })
  },
  // 点击取消按钮的事件
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }
})