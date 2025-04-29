// 引入日期处理工具 (如果需要更复杂的日期操作，可以考虑引入如 dayjs 的库)
// const dayjs = require('dayjs'); // 示例：如果使用 dayjs
const app = getApp();

Page({
  data: {
    labId: null,
    labopentime: null,
    labclosetime: null,
    date: null,
    periods: [],
    resRecords: [],
    selectPeriod: null,
    searchurl: '',
    timeToIndex: {}
  },

  onLoad(options) {
    // console.log(options);
    this.setData({
      labId: options.labId,
      searchurl: app.globalData.apiurl + 'reservation/lab/' + options.labId + '/'
    });
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate();
    const formattedDate = `${year}-${month}-${day}`;

    this.setData({
      date: formattedDate
    });

    const opentime = options.labopentime;
    const closetime = options.labendtime;
    const [openHours, openMinutes] = opentime.split(':').map(Number);
    const [closeHours, closeMinutes] = closetime.split(':').map(Number);
    this.setData({
      labopentime: openHours * 60 + openMinutes,
      labclosetime: closeHours * 60 + closeMinutes
    });
    // console.log(this.data);
    this.prepareTime();
    this.getReservationsRecords();
  },

  prepareTime() {

    let currenttime = this.data.labopentime;
    const closetime = this.data.labclosetime;
    const periods = [];
    const timeToIndexMap = {};
    let index = 0; // 改为 let 而非 const

    while (currenttime < closetime) {
      const startH = Math.floor(currenttime / 60);
      const startM = currenttime % 60;

      const nexttime = currenttime + 30;
      const endH = Math.floor(nexttime / 60);
      const endM = nexttime % 60;
      const startTime = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;
      const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

      periods.push({
        id: index,
        start: startTime,
        end: endTime,
        timeSlot: `${startTime}-${endTime}`,
        isAvailable: true
      });
      timeToIndexMap[startTime] = index;
      index++;
      currenttime = nexttime;
    }
    this.setData({
      periods: periods,
      timeToIndex: timeToIndexMap
    });
    // console.log(periods);
  },

  getReservationsRecords() {
    const url = this.data.searchurl + this.data.date;
    console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        // console.log(res);
        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            resRecords: res.data.data
          });
          // console.log(this.data.resRecords);
          this.processReservationRecords();
        } else {
          wx.showToast({
            title: '其他错误',
            icon: 'error'
          })
        }
      },
      fail: (res) => {
        console.log('123', res);
        wx.showToast({
          title: '网络异常，无法获得预约数据',
          icon: 'none'
        })
      }
    });
  },

  processReservationRecords() {
    const {labopentime, labclosetime, resRecords, periods} = this.data;
    // console.log(resRecords);
    const today = new Date();
    const currentTime = today.getHours() * 60 + today.getMinutes();
    const timeToIndexMap = this.data.timeToIndex;
    console.log(periods);
    for (let i = 0; i < resRecords.length; i++) {
      const record = resRecords[i];
      if (record.reservationStatus != 'confirmed') continue;
      const [endHours, endMinutes] = record.endTime.split(':').map(Number);
      const [startHours, startMinutes] = record.startTime.split(':').map(Number);
      const endTime = endHours * 60 + endMinutes;
      let startTime = startHours * 60 + startMinutes;
      // while (startTime < endTime) {
      //   if (startTime + 30 > currentTime) {
      //     const index = timeToIndexMap[startTime];
          
      //   }
      // }
    }
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})