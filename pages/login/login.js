// pages/login/login.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentId: '',
    textPassword: '',
    loginurl: '',
    showPassword: false,
    selectedIdentity: 'student', // 默认选择学生身份
    identityConfig: {
      student: {
        label: '学号',
        placeholder: '请输入学号'
      },
      teacher: {
        label: '工号',
        placeholder: '请输入工号'
      },
      admin: {
        label: '管理员号',
        placeholder: '请输入管理员号'
      }
    }
  },

  // 选择身份
  selectIdentity(e) {
    const identity = e.currentTarget.dataset.identity;
    this.setData({
      selectedIdentity: identity,
      studentId: '', // 切换身份时清空输入
      textPassword: ''
    });
  },

  togglePasswordVisibility() {
    // console.log('123');
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  trylogin() {
    const { studentId, textPassword, selectedIdentity } = this.data;

    let logindata = {
      userId: studentId,
      userPassword: textPassword
    };

    // console.log('登录数据:', logindata);
    // console.log('选择的身份:', selectedIdentity);
    // console.log('登录URL:', this.data.loginurl);

    if (!studentId) {
      const inputLabel = this.data.identityConfig[selectedIdentity].label;
      wx.showToast({
        title: `请输入${inputLabel}`,
        icon: 'none'
      });
      return;
    }
    if (!textPassword) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中...',
    });
    wx.request({
      url: this.data.loginurl,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userId: studentId,
        userPassword: textPassword 
      },
      success: (res) => {
        // console.log('登录请求成功:', res);
        if (res.statusCode === 200 && res.data.code === 200 && res.data) { 
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
          app.globalData.username = res.data.data.userName;
          app.globalData.userid = studentId; 
          app.globalData.userrole = res.data.data.userRole;
          app.globalData.selectedIdentity = selectedIdentity; // 保存选择的身份
          // console.log("name", app.globalData.username);
          // console.log("identity", app.globalData.selectedIdentity);

          if (app.globalData.userrole == 'user') {
            wx.switchTab({
              url: '/pages/index/index'
            })
          } else {
            wx.navigateTo({
              url: '/pages/management/management',
            })
          }
        } else {
          // console.log(123);
          const errMsg = res.data && res.data.message ? res.data.message : '账号或密码错误';
          wx.showToast({
            title: errMsg,
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('登录请求失败:', err);
        wx.showToast({
          title: '登录请求失败，请检查网络',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log('全局变量:', app.globalData);
    let loginurl = app.globalData.apiurl + 'user/login';
    this.setData({
      loginurl: loginurl
    });
    // console.log(this.data.loginurl);
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
    this.setData({
      studentId: '',
      textPassword: '',
      showPassword: false,
      selectedIdentity: 'student'
    });
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