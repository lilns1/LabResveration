// 获取应用实例
const app = getApp()

Page({
  data: {
    userinfo: {}
  },
  
  onLoad() {
    let url = app.globalData.apiurl + 'user/' + app.globalData.userid;
    // console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        // console.log(res);
        this.setData({
          userinfo: res.data.data
        });
        console.log(this.data.userinfo);
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({
          title: '网络异常，无法获得个人信息',
          icon: 'error'
        })
      }
    })
  },
  
  onShow() {
    // 每次页面显示时获取最新用户信息
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const page = getCurrentPages().pop();
      this.getTabBar().setData({
        value: '/' + page.route
      });
    }
  },


  navigateToSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting'
    });
  },
  
  showAbout() {
    wx.showModal({
      title: '关于实验室预约系统',
      content: '版本号：1.0.1\n开发者：实验室预约系统开发团队\n联系方式：contact@example.com',
      showCancel: false
    });
  },
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          app.globalData.userid = null;
          
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
})