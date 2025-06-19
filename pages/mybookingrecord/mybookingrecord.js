// pages/mybookingrecord/mybookingrecord.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: null,
    userRecords: [],
    lab: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fecthData();
  },

  fecthData() {
    this.setData({
      lab: app.globalData.lab
    });
    // console.log(this.data.lab);
    this.setData({
      userid: app.globalData.userid,
    })
    let url = app.globalData.apiurl + 'reservation/user/' + app.globalData.userid;
    // console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200 && res.data.code === 200 && res.data.data.length) {
          this.setData({
            userRecords: res.data.data
          })
          // console.log(this.data.userRecords);
          this.dealCurrentTime();
        } 
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '获取数据异常',
          icon: 'error'
        })
      }
    })
  },

  dealCurrentTime() {
    const now = new Date();
    const { userRecords } = this.data;
    const updatedRecords = [...userRecords];
    
    for (let i = 0; i < updatedRecords.length; i++) {
      const record = updatedRecords[i];
      if (record.reservationStatus === "confirmed") {
        const reservationDateParts = record.reservationDate.split("-");
        const endTimeParts = record.endTime.split(":");
        
        const reservationEndTime = new Date(
          parseInt(reservationDateParts[0]),
          parseInt(reservationDateParts[1]) - 1,
          parseInt(reservationDateParts[2]),
          parseInt(endTimeParts[0]),
          parseInt(endTimeParts[1]),
          parseInt(endTimeParts[2] || 0)
        );
        if (reservationEndTime < now) {
          updatedRecords[i] = {
            ...record,
            reservationStatus: "completed"
          };
        }
      }
    }
    if (JSON.stringify(updatedRecords) !== JSON.stringify(userRecords)) {
      this.setData({
        userRecords: updatedRecords
      });
    }
  },

  cancelreservation(e) {
    // console.log(e);
    let url = app.globalData.apiurl + 'reservation/' + e.currentTarget.dataset.reservationid + '/cancel';
    console.log(url);
    wx.request({
      url: url,
      method: 'PUT',
      success: (res) => {
        // console.log(res);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          })
          wx.redirectTo({
            url: '/pages/mybookingrecord/mybookingrecord',
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '网络异常',
          icon: 'error'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.fecthData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})