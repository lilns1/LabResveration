// 引入日期处理工具 (如果需要更复杂的日期操作，可以考虑引入如 dayjs 的库)
// const dayjs = require('dayjs'); // 示例：如果使用 dayjs
const app = getApp();

Page({
  data: {
    labId: null,
    labCapacity: null,
    labopentime: null,
    labclosetime: null,
    date: null,
    periods: [],
    resRecords: [],
    startTimeId: null,  // 新增：起始时间ID
    endTimeId: null,    // 新增：结束时间ID
    selectedTimeRange: "", // 新增：显示已选择的时间范围
    searchurl: '',
    timeToIndex: {},
    dateList: [],  // 用于存储日期选择列表
    purpose: '',   // 预约目的
    canSubmit: false // 是否可以提交  
  },

  onLoad(options) {
    // console.log(options);
    this.setData({
      labId: options.labId,
      searchurl: app.globalData.apiurl + 'reservation/lab/' + options.labId + '/',
      labCapacity: options.labcapacity
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
    this.setData({
      labopentime: this.timeToMinute(opentime),
      labclosetime: this.timeToMinute(closetime)
    });
    // console.log(this.data);
    this.generateDateList();
    this.prepareTime();
    this.getReservationsRecords();
  },

  // 生成日期列表方法
  generateDateList() {
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dateList = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {  // 只生成5天
      const date = new Date();
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayName = i === 0 ? '今天' : dayNames[date.getDay()];
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      dateList.push({
        dateStr,
        year,
        month,
        day,
        dayName
      });
    }
    
    this.setData({ dateList });
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
        capacity: this.data.labCapacity,
        isAvailable: true,
        info: ''
      });
      timeToIndexMap[this.timeToMinute(startTime)] = index;
      index++;
      currenttime = nexttime;
    }
    this.setData({
      periods: periods,
      timeToIndex: timeToIndexMap,
      startTimeId: null,
      endTimeId: null,
      selectedTimeRange: "",
      canSubmit: false
    });
  },

  getReservationsRecords() {
    const url = this.data.searchurl + this.data.date;
    console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            resRecords: res.data.data
          });
          this.processReservationRecords();
        } else {
          wx.showToast({
            title: '其他错误',
            icon: 'error'
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络异常，无法获得预约数据',
          icon: 'none'
        })
      }
    });
  },

  processReservationRecords() {
    const { resRecords, periods } = this.data;
    console.log("处理预约记录:", resRecords.length);
    
    const timeToIndexMap = this.data.timeToIndex;
    
    for (let i = 0; i < resRecords.length; i++) {
      const record = resRecords[i];
      if (record.reservationStatus !== 'confirmed') continue;
      
      const endTime = this.timeToMinute(record.endTime);
      const startTime = this.timeToMinute(record.startTime);
      let indexTime = startTime;
      
      while (indexTime < endTime) { 
        const index = timeToIndexMap[indexTime];
        if (index !== undefined) {
          periods[index].capacity --;
          if (periods[index].capacity <= 0) {
            periods[index].isAvailable = false;
            periods[index].info = '预约已满'
          }
          // console.log(`设置已预约时段: ${periods[index].timeSlot} 为不可用`);
        }
        indexTime += 30;
      }
    }
    
    const today = new Date();
    const selectedDate = new Date(this.data.date);
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    // console.log("当前日期:", today.toDateString());
    // console.log("选择日期:", selectedDate.toDateString());
    // console.log("是否为今天:", isToday);
    
    if (isToday) {
      const currentTime = today.getHours() * 60 + today.getMinutes();
      console.log("当前时间(分钟):", currentTime);
      
      for (let i = 0; i < periods.length; i++) {
        const endtime = this.timeToMinute(periods[i].end);
        if (endtime <= currentTime) {
          periods[i].isAvailable = false;
          periods[i].info = '已过时';
          // console.log(`设置过期时段: ${periods[i].timeSlot} 为不可用`);
        }
      }
    }

    for (let i = 0; i < periods.length; i ++) {
      if (periods[i].isAvailable) {
        periods[i].info = '剩余:' + periods[i].capacity; 
      }
    }
    this.setData({
      periods: periods
    });
  },
  
  onDateChange(e) {
    const selectedDate = e.currentTarget.dataset.date;
    if (selectedDate === this.data.date) return;
    
    this.setData({
      date: selectedDate,
      startTimeId: null,
      endTimeId: null,
      selectedTimeRange: "",
      purpose: '',
      canSubmit: false
    });
    
    this.prepareTime();
    this.getReservationsRecords();
  },

  // 修改为实现起点和终点选择的逻辑
  selectTimeSlot(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const period = this.data.periods.find(p => p.id === id);
    
    if (!period || !period.isAvailable) {
      wx.showToast({
        title: '该时间段不可选',
        icon: 'none'
      });
      return;
    }
    if (this.data.startTimeId === null || 
        (this.data.startTimeId !== null && this.data.endTimeId !== this.data.startTimeId)) {
      this.setData({
        startTimeId: id,
        endTimeId: id,
        selectedTimeRange: "",
      });
    }
    
    else if (this.data.startTimeId !== null && this.data.endTimeId === this.data.startTimeId) {
      if (id === this.data.startTimeId) {
        this.setData({
          startTimeId: null,
          endTimeId: null,
          canSubmit: false,
          selectedTimeRange: ""
        });
        return;
      }
      
      if (id < this.data.startTimeId) {
        this.setData({
          endTimeId: this.data.startTimeId,
          startTimeId: id
        });
      } else {
        this.setData({
          endTimeId: id
        });
      }
      
    }  
    if (!this.checkTimeRangeAvailability()) {
      wx.showToast({
        title: '所选时间段中有不可用时间',
        icon: 'none'
      });
      this.setData({
        startTimeId: null,
        endTimeId: null,
        canSubmit: false,
        selectedTimeRange: ""
      });
      return;
    }

    const startPeriod = this.data.periods.find(p => p.id === this.data.startTimeId);
    const endPeriod = this.data.periods.find(p => p.id === this.data.endTimeId);
    if (startPeriod && endPeriod) {
      const selectedTimeRange = `${startPeriod.start}-${endPeriod.end}`;
      this.setData({
        selectedTimeRange,
        canSubmit: !!this.data.purpose
      });
    }
    
  },

  checkTimeRangeAvailability() {
    const startId = this.data.startTimeId;
    const endId = this.data.endTimeId;
    
    for (let i = startId; i <= endId; i++) {
      const period = this.data.periods.find(p => p.id === i);
      if (!period || !period.isAvailable) {
        return false;
      }
    }
    return true;
  },

  onPurposeInput(e) {
    const purpose = e.detail.value;
    this.setData({
      purpose,
      canSubmit: purpose && this.data.startTimeId !== null && this.data.endTimeId !== null
    });
  },

  submitReservation() {
    if (!this.data.canSubmit) return;
    
    const startPeriod = this.data.periods.find(p => p.id === this.data.startTimeId);
    const endPeriod = this.data.periods.find(p => p.id === this.data.endTimeId);
    
    if (!startPeriod || !endPeriod) return;
    
    wx.showLoading({ title: '提交中...' });

    const postdata = {
      userId: app.globalData.userid, 
      labId: parseInt(this.data.labId),
      reservationDate: this.data.date, 
      startTime: startPeriod.start + ":00", 
      endTime: endPeriod.end + ":00", 
      purpose: this.data.purpose
    };
    console.log(postdata);
    
    wx.request({
      url: app.globalData.apiurl + 'reservation',
      method: 'POST',
      data: postdata,
      success: (res) => {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode === 200 && res.data.code === 200) {
          wx.showToast({
            title: '预约成功',
            icon: 'success'
          });
          wx.redirectTo({
            url: '/pages/mybookingrecord/mybookingrecord',
          })
        } else {
          wx.showToast({
            title: res.data.message || '预约失败',
            icon: 'error'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  timeToMinute(timeString) {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})