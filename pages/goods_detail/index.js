// pages/goods_detail/index.js
/* 
1 发送请求 获取数据
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
3 点击加入购物车
  1 绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 判断当前商品是否已经存在购物车中
  4 已经存在 修改商品数据 执行购物车数量++  重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上购物数量属性 num 重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候 加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏
    1 是 改变页面的图标
    2 不是 
  3 点击商品收藏按钮
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
*/
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  // 商品对象
  GoodsInfo: {},
  // 商品是否被收藏
  isCollect: false,

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   console.log(options);
  //   const {goods_id} = options;
  //   this.getGoodsDetail(goods_id);
  // },
  onShow: function() {
    let pages =  getCurrentPages();
    console.log(pages);
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },
  async getGoodsDetail(goods_id) {
    const result = await request({url: "/goods/detail", data: {goods_id}});
    console.log(result);
    this.GoodsInfo = result.data.message; 
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: result.data.message.goods_name,
        goods_price: result.data.message.goods_price,
        // iphone部分手机不识别webp格式的图片
        // 1 确保后台存在webp => jpg
        goods_introduce: result.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: result.data.message.pics,
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImge(e) {
    console.log(e);
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 接收传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    });
  },
  // 点击加入购物车
  handleCartAdd() {
    // 1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断当前商品是否已存在于购物车
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1) {
      // 不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 已存在
      cart[index].num++;
    }
    // 把购物车数据重新添加缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户手抖 疯狂点击
      mask: true
    });
  },
  // 点击商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数据
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断该商品是都被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 
    if(index !== -1) {
      // 能找到
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中的属性
    this.setData({
      isCollect
    })
  }
})