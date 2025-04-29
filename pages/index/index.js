// pages/index/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    searchurl: ' ',
    reserArr: [],
    currentIndex: Number,
    lab: []
  },
  handletap(e) {
    console.log(e.currentTarget.dataset.tar);
    wx.navigateTo({
      url: e.currentTarget.dataset.tar,
    });
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
      searchurl: app.globalData.apiurl + 'reservation/user/' + app.globalData.userid
    })
    // console.log(this.data.searchurl);
    wx.request({
      url: this.data.searchurl,
      method: 'GET',
      success: (res) => {
        // console.log(res);
        if (res.statusCode === 200 && res.data.code === 200 && res.data.data.length) {
          this.setData({
            reserArr: res.data.data
          })
          // console.log(123);
          this.getmyfirstRecord();
        } else {
          this.setData({
            currentIndex: -1
          });
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

  getmyfirstRecord() {
    const now = new Date(); // 获取当前时间
    const reservations = this.data.reserArr; // 获取预约记录数组
    let foundIndex = -1; // 初始化找到的索引为 -1 (表示未找到)

    // console.log("Current time:", now);
    // console.log("Reservations to check:", reservations);

    for (let i = 0; i < reservations.length; i++) {
      const reservation = reservations[i];
      const reservationEndDateStr = reservation.reservationDate.replace(/-/g, '/') + ' ' + reservation.endTime;
      const reservationEndDateTime = new Date(reservationEndDateStr);
      // console.log('1', reservationEndDateTime);
      if (!isNaN(reservationEndDateTime.getTime()) && reservationEndDateTime > now && reservation.reservationStatus == 'confirmed') {
        foundIndex = i;
        // console.log(`Found matching reservation at index ${i}`);
        break; 
      }
    }

    // 循环结束后，更新 currentIndex 的值
    this.setData({
      currentIndex: foundIndex
    });
    // console.log('Final currentIndex set to:', foundIndex);
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const page = getCurrentPages().pop();
      this.getTabBar().setData({
        value: '/' + page.route
      });
    }
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