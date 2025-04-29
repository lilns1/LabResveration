// pages/register/register.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentId: '',
    name: '',
    textPassword: '',
    textPassword2: '',
    registerurl: '',
    showPassword: false
  },

  togglePasswordVisibility() {
    this.setData({
      showPassword: !this.data.showPassword
    });
    console.log(this.data.showPassword);
  },

  tryRegister() {
    let {studentId, name, textPassword, textPassword2} = this.data;
    if (studentId.length == 0 || name.length == 0 || textPassword.length == 0 || textPassword2.length == 0) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    if (textPassword != textPassword2) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: this.data.registerurl,
      method: 'POST',
      data: {
        userId: studentId,
        userName: name,
        userPassword: textPassword
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        } else if (res.statusCode === 500) {
          wx.showToast({
            title: '密码至少需要6位',
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'error'
          })
        }
      },
      fail: (err) => {
        console.error(err);
        wx.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none'
        });
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取全局变量
    this.setData({
      registerurl: app.globalData.apiurl + 'user/register'
    });
    // console.log(this.data.registerurl);
    
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