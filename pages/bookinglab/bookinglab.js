// pages/bookinglab/bookinglab.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lab: [],
    filteredlab: [],
    searchKeyword: ''
  },

  handleSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  handleSearch(e) {
    const keyword = this.data.searchKeyword.trim().toLowerCase();
    console.log(keyword);
    if (!keyword) {
      // 如果搜索词为空，显示全部实验室
      this.setData({
        filteredlab: this.data.lab
      });
      return;
    }
    // 按名称或位置过滤实验室
    const filtered = this.data.lab.filter(item => {
      return (
        item.labName.toLowerCase().includes(keyword) || 
        (item.labLocation && item.labLocation.toLowerCase().includes(keyword)) ||
        (item.labDescription && item.labDescription.toLowerCase().includes(keyword))
      );
    });
    
    this.setData({
      filteredlab: filtered
    });
    // console.log('filteredlab',this.data.filteredlab);
  },
  
  selectLab(e) {
    // console.log(e);
    const labset = e.currentTarget.dataset;
    wx.redirectTo({
      url: '/pages/choosetime/choosetime?labId=' + labset.labid + '&labopentime=' + labset.labopentime + '&labendtime=' + labset.labendtime
      + '&labcapacity=' + labset.labcapacity
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      lab: app.globalData.lab,
      filteredlab: app.globalData.lab
    });
    // console.log('filteredlab',this.data.filteredlab);
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