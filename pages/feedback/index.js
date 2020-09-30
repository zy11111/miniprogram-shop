// pages/feedback/index.js
/* 
1 点击”+“触发tap事件
  1 调用小程序内置 选择图片的api
  2 获取到 图片的路径 数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击提交
  1 获取文本域的内容
    1 data中定义变量 表示输入框内容
    2 文本域绑定输入事件 事件触发的时候 把输入框的值 存入到data中
  2 对这些内容 进行合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器  前端的模拟
  5 清空当前页面
  6 返回上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 选中的图片路径
    chooseImgs: [],
    // 文本域的内容
    textValue: ""
  },
  // 外网的图片路径的数组
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    const {index} = e.detail;
    const {tabs} = this.data;
    tabs.forEach((v, i) => {
      i===index?v.isActive=true:v.isActive=false;
    });
    this.setData({
      tabs
    })
  },
  // 点击加号
  handleChooseImg() {
    // 调用小程序内置的选择图片的api
    wx.chooseImage({
      // 允许上传的图片数量
      count: 9,
      // 图片尺寸 原始 压缩
      sizeType: ['original', 'compressed'],
      // 选择图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },
  // 
  handleRemoveImg(e) {
    console.log(e);
    // 获取被点击元素的索引
    const {index} = e.currentTarget.dataset;
    // 获取data数组
    const {chooseImgs} = this.data;
    // 删除对应索引的元素
    chooseImgs.splice(index, 1);
    // 修改data
    this.setData({
      chooseImgs
    })
  },
  // 文本域的获取事件
  handleTextInput(e) {
    console.log(e);
    const {value} = e.detail;
    this.setData({
      textValue: value
    })
  },
  // 提交按钮的绑定事件
  handleFormSubmit() {
    // 获取文本域的内容
    const {textValue, chooseImgs} = this.data;
    // 合法性验证
    if(!textValue.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: "none",
        mask: true
      });
      return;
    }
    // 准备上传图片 到专门的图片服务器
    // 上传文件的api不支持多个文件同时上传 遍历数组 挨个上传
    const token = wx.getStorageSync("token");
    console.log(token);
    // 显示正在上传中
    wx.wx.showLoading({
      title: '正在上传中',
      mask: true
    });
      
    // 判断有没有需要上传的图片数组
    if(chooseImage.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 上传到的服务器地址
          url: 'https://images.ac.cn/api/upload/upload?apiType="ali"&image=image&token="'+token+'"',
          // url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // url: 'https://iimg.com.cn/api/upload',
          // url: 'https://sm.ms/api/upload',
          // 文件路径
          filePath: v,
          // 上传的文件名称 后台来获取数据 file
          name: 'image',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
  
            // 所有图片上传完毕
            if(i === chooseImage.length-1) {
              wx.hideLoading();
              console.log("文本和外网图片数组")
              // 重置页面
              this.setData({
                textValue: "",
                chooseImage: []
              })
              wx.navigateBack({
                delta: 1
              });
                
            }
          }
        });
      })
    } else {
      wx.hideLoading();
      // 提交文本
      wx.navigateBack({
        delta: 1
      });
        
    }
       
    
    
      
  }
})