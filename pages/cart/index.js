// pages/cart/index.js
/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置api 获取用户的收货地址
  3 获取用户对小程序所授予获取地址的权限状态scope
    1 假设用户点击获取地址的提示框 确认 authSetting  scope.address
      scope 值为true 直接调用获取收货地址
    2 假设用户重来没有调用过收货地址的api
      scope 值为 undefined 直接调用获取收货地址
    3 假设用户点击获取地址的提示框 取消
      scope 值为 false  
      1 诱导用户自己打开授权设置页面（openSetting） 当用户重新给予获取地址权限的时候
      2 获取收货地址
    4 把获取到的收货地址 存入到本地存储中
2 页面加载完毕
  0 onLoad  onShow
  1 获取本地存储中的地址数据
  2 把数据设置给data中的一个变量
3 onShow
  0 在商品详情页面第一次添加商品是添加属性checked
  1 获取缓存中数组
  2 将购物车数据填充到data中
4 全选实现
 1 onShow获取缓存中的购物车数组
 2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全被选中
5 总价格和总数量
  1 都需要商品被选中
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  6 总数量 += 商品的数量
  7 把计算后的价格和数量设置回data中
6 商品的选中功能
  1 绑定change事件
  2 获取到被修改的商品数据
  3 商品对象的选中状态取反
  4 重新填充回data中和缓存中
  5 重新计算全选和总价格、总数量
7 全选和反选功能
  1 全选复选框绑定事件change
  2 获取data中的全选变量
  3 直接取反
  4 遍历购物车数组 让里面的购物车商品选中状态跟随改变
  5 把购物车数组和allChecked重新设置回data中
  6 把购物车数组重新存入缓存中
8 商品数量的编辑功能
  1 “+” “-”按钮绑定同一个点击事件 自定义属性
    1 “+” +1
    2 “-” -1
  2 传递被点击的商品id
  3 获取data中的购物车数据 获取需要被修改的商品对象
  4 当购物车数量等于1 
    询问用户 弹窗提示（showModal） 是否删除
    1 确定 直接删除
    2 取消
  5 直接修改商品的num
  6 把cart数组重新设置回缓存中和data中
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选中商品
  3 经过以上的验证 跳转到支付页面
*/
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow: function() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 从缓存中获取购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选
    // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么 every的返回值为true
    // 只要有一个返回false 就直接返回false
    // 空数组调用every方法 返回值为true
    // const allChecked = cart.length?cart.every(v => v.checked):false;
    this.setData({
      address
    })
    this.setCart(cart);
  },
  // 点击收获地址
  async handleChooseAddress() {
    // // 1 获取权限状态  主要发现一些属性名很怪异的时候 都要使用 [] 形式来获取属性值
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       // 获取用户收货地址
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1);
    //         }
    //       });
    //     } else {
    //       // 用户曾经拒绝过授予权限  引导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 可以调用获取收获地址
    //           console.log(result2);
    //         }
    //       });
    //     }
    //   }
    // });

    try {
      // 获取权限状态
    const result1 = await getSetting();
    const scopeAddress = result1.authSetting["scope.address"];
    // 判断权限状态
    if(scopeAddress === false) {
      await openSetting();
    }
    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    console.log(address);
    wx.setStorageSync("address", address);
    } catch(err) {
      console.log(err);
    }
  },
  // 商品的选中状态
  handleItemChange(e) {
    // 1 获取商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车列表
    let {cart} = this.data;
    // 3 找到被修改的商品
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5 6 把购物车数据重新设置回data中和缓存中
    this.setCart(cart);
    
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    wx.setStorageSync("cart", cart);
    // 7 重新计算总价格总数量
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(v => {
      if(v.checked) {
        totalNum += v.num;
        totalPrice += v.num * v.goods_price;
      } else {
        allChecked = false;
      }
    });
    // 判断是否是空数组
    allChecked = cart.length!=0?allChecked:false;
    // 给data中的cart赋值
    // 2 把数据设置给data中的address
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
  },
  // 全选 反选 复选框绑定事件
  handleItemAllCheck() {
    console.log("handleChange")
    // 获取复选框的值
    let {cart, allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v => {
      v.checked = allChecked;
    })

    this.setData({
      allChecked,
      cart
    })
    wx.setStorageSync("cart", cart);
  },
  // 编辑商品数量的点击事件
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const goods_id = e.currentTarget.dataset.id;
    const {operation} = e.currentTarget.dataset;
    console.log(goods_id, operation)
    // 获取购物车数据
    let {cart} = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id == goods_id);
    if(cart[index].num === 1 && operation === -1) {
      // wx.showModal({
      //   title: '',
      //   content: '确认删除吗？',
      //   success: (result) => {
      //     if (result.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     }
      //   }
      // });
      const content = "确认删除吗？";
      const result = await showModal({content});
      if (result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
    // this.setData({
    //   cart
    // })
    // wx.setStorageSync("cart", cart);
  },
  // 点击结算事件
  async handlePay() {
    console.log("handlePay")
    // 判断收货地址
    const {address, totalNum} = this.data;
    if(!address.userName) {
      await showToast({title: "您还没有选择收货地址"});
      return;
    }
    // 判断是否选购商品
    if(totalNum === 0) {
      await showToast({title: "您还没有选购商品"});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
  }
})