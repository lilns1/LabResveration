// pages/bookinglab/bookinglab.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lib: [
      {
        id: "X301",
        name: "网络实训室",
        capacity: 60,
        label: 'zheshiwangluoshixunshi'
      },
      {
        id: "Y602",
        name: "软件实训室",
        capacity: 50,
        label: '有很多电脑'
      }
    ]
  },
  gotime(e) {
    console.log(e);
    let libid = e.currentTarget.dataset.lab;
    wx.navigateTo({
      url: '/pages/choosetime/choosetime?libid=' + libid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取lib数据
    
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