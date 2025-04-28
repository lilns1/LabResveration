// app.js
App({
  onLaunch() {
    // 保存 this 引用以便在回调中使用
    const that = this;
    
    wx.request({
      url: 'http://8.148.69.111:8080/lab',
      method: 'GET',
      // 修复回调格式，改为箭头函数保留 this 指向
      success: (res) => {
        // 直接修改 globalData，不要使用 setData
        this.globalData.lib = res.data.data;
        // console.log(this.globalData.lib);
      },
      fail: (res) => {
        // console.log('456', res);
        wx.showToast({
          title: '获取数据异常',
          icon: 'error'
        })
      }
    });
  },
  globalData: {
    userid: '231170020073',
    apiurl: 'http://8.148.69.111:8080/',
    lib: []
  }
})
