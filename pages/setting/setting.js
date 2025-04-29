// pages/setting/setting.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    userName: '', // 用户姓名
    userPassword: '', // 用户密码
    confirmPassword: '' // 确认密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userid
    })
  },

  updateUserInfo: function() {
    const {userId, userName, userPassword, confirmPassword } = this.data;

    if (userPassword) {
      if (userPassword.length < 6) {
        wx.showToast({
          title: '密码长度不能少于6位',
          icon: 'none'
        });
        return;
      }
      
      if (userPassword !== confirmPassword) {
        wx.showToast({
          title: '两次输入密码不一致',
          icon: 'error'
        });
        return;
      }
    }

    const updateData = {
      "userId": userId,
      "userName": userName === '' ? app.globalData.username : userName,
      "userPassword": userPassword
    };
    // console.log(updateData);
    const url = app.globalData.apiurl + 'user/' + userId;
    // console.log(url);
    wx.request({
      url:  url,
      method: 'PUT',
      data: updateData,
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        // console.log(res);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '更新成功',
            icon: 'success'
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.message || '更新失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('更新用户信息失败:', err);
        wx.showToast({
          title: '网络异常，请重试',
          icon: 'none'
        });
      }
    });
  }
});