// pages/pay/index.js
/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据 checked = true
2 微信支付
  1 哪些人 哪些账号 可以实现微信支付
    1 企业账号
    2 企业账号小程序后台中 必须给 开发者 添加上白名单
      1 一个appid可以同时绑定多个开发者
      2 这些开发者就可以共用这个appid和它的开发权限
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token
  3 有token  
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中已经选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面
*/
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from '../../utils/asyncWx.js'
import { request } from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 从缓存中获取购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤
    cart = cart.filter(v => v.checked);
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalNum += v.num;
      totalPrice += v.num * v.goods_price;
    })
    // 给data赋值
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    })
  },
  // 点击支付事件
  async handleOrderPay() {
    try {
      console.log("handleOrderPay ")
      // 1 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2 判断
      if(!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;  
      } else {
        console.log("已经有token了");
        // 请求头参数
        // const header = {Authorization: token};
        // 请求体参数
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address.all;
        let goods = [];
        // 筛选过的cart
        const cart = this.data.cart;
        cart.forEach(v => goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        }))
        const orderParams = {order_price, consignee_addr, goods};
        // 创建订单
        const res = await request({url: "/my/orders/create", data: orderParams, method: "POST"});
        const {order_number} = res.data.message;
        console.log(order_number);
        // 发起预支付
        const result = await request({url: "/my/orders/req_unifiedorder", data: {order_number}, method: "POST"});
        const {pay} = result.data.message;
        console.log(pay);
        // 发起微信支付
        const result2 = await requestPayment(pay);
        console.log(result2);
        // 查询后台订单状态
        const result3 = await request({url: "/my/orders/chkOrder", data: {order_number}, method: "POST"});
        console.log(result3);
        await showToast({title: "支付成功"});
        // 手动删除缓存中已经支付的商品
        let newCart = wx.getStorageSync("cart");
        newCart.filter(v => !v.checked);
        wx.wx.setStorageSync('cart', newCart);
          
        // 支付成功了 跳转到订单页面
        wx.navigateTo({
          url: '/pages/order/index'
        })
      }
    } catch(error) {
      await showToast({title: "支付失败"});
      console.log(error);
    }
  }
})