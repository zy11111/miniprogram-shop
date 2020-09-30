//  getSetting
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

//  chooseAddress
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

//  openSetting
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

// showModal
export const showModal = ({content}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '',
        content: content,
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err);
        }
    });
      
  })
}

// showToast
export const showToast = ({title}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: "none",
      mask: true,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

// login
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout:10000,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
      
  })
}

// 微信支付接口
// requestPayment
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
      
  })
}