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
    this.setData({
      lab: app.globalData.lab
    });
    // console.log(this.data.lab);
    this.setData({
      userid: app.globalData.userid,
    })
    let url = app.globalData.apiurl + 'reservation/user/' + app.globalData.userid;
    console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        // console.log(res);
        if (res.statusCode === 200 && res.data.code === 200 && res.data.data.length) {
          this.setData({
            userRecords: res.data.data.reverse()
          })
          console.log(this.data.userRecords);
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
            title: '预约成功',
            icon: 'success'
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