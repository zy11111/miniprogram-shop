// pages/category/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0 web中的本地存储和小程序中的本地存储的区别
      1 写代码的方式不一样了
        web: localStorage.setItem("key", "value")  localStorage.getItem("key")
        小程序：wx.setStorageSync("key", "value") wx.getStorageSync("key")
      2 存的时候有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会调用以下toString()，把数据变成了字符串再存入进去
        小程序：不存在类型转换的这个操作，存什么类似的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(), data:[...]}
    2 没有旧数据 直接发送新请求
    3 有旧的数据 同时 旧的数据也没有数据 就使用本地存储中旧的数据即可
    */
    //  1 获取本地存储中的数据(小程序中也是存在本地存储技术)
    const Cates = wx.getStorageSync("cates");
    // 判断
    if(!Cates) {
      // 不存在
      this.getCatesList();
    } else {
      // 有旧的数据 设置过期事件10s
      if(Date.now()-Cates.time > 1000*10) {
        // 重新发送请求
        this.getCatesList();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCatesList() {
    // request({url: "/categories"})
    // .then(result => {
    //   console.log(result)
    //   this.Cates =  result.data.message
    //   // 把接口的数据存到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(), data: this.Cates});
        

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    
    // 1 使用es7的async、await来发送请求
    const result = await request({url: "/categories"});
      console.log(result)
      this.Cates =  result.data.message
      // 把接口的数据存到本地存储中
      wx.setStorageSync("cates", {time:Date.now(), data: this.Cates});
        

      // 构造左侧的大菜单数据
      let leftMenuList = this.Cates.map(v=>v.cat_name);
      // 构造右侧的商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 打印事件源
    console.log(e);
    // 获取被点击的标题的索引
    const {index} = e.currentTarget.dataset;
    // 根据不同的索引渲染右侧的内容数据
    let rightContent = this.Cates[index].children;
    // 给data中的currentIndex赋值
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0
    })
  }

})