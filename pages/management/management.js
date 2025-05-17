// pages/management/management.js
const app=getApp();

Page({
  data: {
    userCount: 0,
    pendingCount: 0,
    labCount: 0
  },
  
  onLoad: function() {
  },
  
  onShow: function() {
    this.loadStatistics();
  },
  
  // 加载统计数据
  loadStatistics: function() {
    const url = app.globalData.apiurl;
    wx.request({
      url: url + 'user',
      method: 'GET',
      success: (res) => {
        // console.log(123, res);
        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            userCount: res.data.data.length - 1
          });
        }
      }
    });
    
    let reservation = [], pendingcnt = 0;
    wx.request({
      url: url + 'reservation',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          reservation = res.data.data
          for (let i = 0; i < reservation.length; i ++) {
            if (reservation[i].reservationStatus == "pending")
              pendingcnt ++;
          }
          this.setData({
            pendingCount: pendingcnt
          });
        }
      }
    })

    wx.request({
      url: url + 'lab',
      method: 'GET',
      success: (res) => {
        // console.log(234, res);
        if (res.statusCode === 200) {
          this.setData({
            labCount: res.data.data.length
          });
        }
      }
    })

  },
  
  // 页面导航
  navigateTo: function(e) {
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
    });
  }
})