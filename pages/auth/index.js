// pages/auth/index.js
import { request } from '../../request/index'
import { login } from '../../utils/asyncWx';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户信息
  async handleGetUserrInfo(e) {
    try {
      console.log(e);
      // 1 获取用户信息
      const {encryptedData, iv, rawData, signature} = e.detail;
      // 2 获取小程序登录成功后的code
      const {code} = await login();
      console.log(code);
      const loginParams = {encryptedData, rawData, iv, signature, code};
      // 3 发送请求获取用户的token
      const res = await request({url:'/users/wxlogin', data: loginParams, method: 'post'});
      console.log(res)
      // 应该是这一步
      // const {token} = res;
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        // 返回上一层
        delta: 1
      });
    } catch(error) {
      console.log(error);
    }
      
  }
})