// 引入日期处理工具 (如果需要更复杂的日期操作，可以考虑引入如 dayjs 的库)
// const dayjs = require('dayjs'); // 示例：如果使用 dayjs

Page({
  data: {
    labId: null, // 实验室ID
    selectedDate: '', // 当前选择的日期 YYYY-MM-DD
    startDate: '', // 可选的最早日期
    endDate: '', // 可选的最晚日期
    availableTimes: [], // 当前日期可用的时间段列表
    // 结构示例: [{id: 1, timeRange: '08:00 - 08:30', available: true}, ...]
    selectedTimeSlotId: null, // 当前选中的时间段ID
    selectedTimeRange: '', // 当前选中的时间段范围
    purpose: '', // 预约目的
    operatingHours: { // 实验室开放时间（示例）
      start: 8, // 早上 8 点
      end: 22   // 晚上 10 点
    },
    timeInterval: 30 // 时间段间隔（分钟）
  },

  onLoad(options) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 默认选择明天
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7); // 最多可选未来7天

    this.setData({
      labId: options.labId,
      selectedDate: this.formatDate(tomorrow), // 默认选中明天
      startDate: this.formatDate(today), // 从今天开始可选
      endDate: this.formatDate(sevenDaysLater) // 最多可选未来7天
    });

    // 页面加载时获取默认选中日期的时间段
    this.fetchAvailableTimeSlots(this.data.selectedDate, this.data.labId);
  },

  // 格式化日期为 YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 日期选择器变化
  bindDateChange(e) {
    const newDate = e.detail.value;
    this.setData({
      selectedDate: newDate,
      availableTimes: [], // 清空旧的时间段
      selectedTimeSlotId: null, // 清空选择
      selectedTimeRange: ''
    });
    // 获取新日期的时间段
    this.fetchAvailableTimeSlots(newDate, this.data.labId);
  },

  // --- 获取时间段的核心逻辑 ---
  fetchAvailableTimeSlots(date, labId) {
    console.log(`Fetching time slots for lab ${labId} on ${date}`);
    wx.showLoading({ title: '加载中...' });

    // --- 模拟后端请求 ---
    // 在实际应用中，这里应该调用 wx.request 向后端发送请求
    // wx.request({
    //   url: 'YOUR_BACKEND_API_ENDPOINT',
    //   method: 'GET',
    //   data: {
    //     labId: labId,
    //     date: date
    //   },
    //   success: (res) => {
    //     if (res.statusCode === 200 && res.data.success) {
    //       const bookedSlotsData = res.data.bookedSlots; // 假设后端返回已预订的时间段 [{start: 'YYYY-MM-DD HH:mm:ss', end: 'YYYY-MM-DD HH:mm:ss'}, ...]
    //       const allSlots = this.generateAllTimeSlots(date);
    //       const availableTimes = this.markUnavailableSlots(allSlots, bookedSlotsData);
    //       this.setData({ availableTimes });
    //     } else {
    //       wx.showToast({ title: '加载失败', icon: 'none' });
    //       this.setData({ availableTimes: this.generateAllTimeSlots(date) }); // 出错时显示所有都可选（或都不可选）
    //     }
    //   },
    //   fail: (err) => {
    //     console.error("API request failed:", err);
    //     wx.showToast({ title: '网络错误', icon: 'none' });
    //     this.setData({ availableTimes: this.generateAllTimeSlots(date) }); // 出错时显示所有都可选（或都不可选）
    //   },
    //   complete: () => {
    //     wx.hideLoading();
    //   }
    // });
    // --- 模拟结束 ---

    // --- 使用模拟数据代替后端请求 ---
    setTimeout(() => {
      // 模拟后端返回的已预订时间段
      const bookedSlotsData = [
        { start: `${date} 09:00:00`, end: `${date} 10:00:00` },
        { start: `${date} 14:30:00`, end: `${date} 15:30:00` },
        { start: `${date} 18:00:00`, end: `${date} 18:30:00` },
      ];
      const allSlots = this.generateAllTimeSlots(date);
      const availableTimes = this.markUnavailableSlots(allSlots, bookedSlotsData);
      this.setData({ availableTimes });
      wx.hideLoading();
    }, 500); // 模拟网络延迟
    // --- 模拟数据结束 ---
  },

  // 生成一天中所有的时间段
  generateAllTimeSlots(date) {
    const slots = [];
    const { start, end } = this.data.operatingHours;
    const interval = this.data.timeInterval;
    let idCounter = 1;

    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const slotStart = new Date(`${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
        const slotEnd = new Date(slotStart.getTime() + interval * 60 * 1000);

        // 确保结束时间不超过实验室关闭时间
        const endOfDay = new Date(`${date} ${String(end).padStart(2, '0')}:00:00`);
        if (slotEnd > endOfDay) {
          continue; // 如果结束时间超过了关闭时间，则不生成这个时间段
        }

        const startTimeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const endHour = slotEnd.getHours();
        const endMinute = slotEnd.getMinutes();
        const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

        slots.push({
          id: idCounter++,
          timeRange: `${startTimeStr} - ${endTimeStr}`,
          startDateTime: slotStart, // 保留 Date 对象用于比较
          endDateTime: slotEnd,     // 保留 Date 对象用于比较
          available: true // 默认都可选
        });
      }
    }
    return slots;
  },

  // 根据已预订信息标记不可用的时间段
  markUnavailableSlots(allSlots, bookedSlotsData) {
    if (!bookedSlotsData || bookedSlotsData.length === 0) {
      return allSlots; // 没有预订记录，所有都可用
    }

    // 将预订时间字符串转换为 Date 对象，方便比较
    const bookedRanges = bookedSlotsData.map(b => ({
      start: new Date(b.start.replace(/-/g, '/')), // 兼容 iOS
      end: new Date(b.end.replace(/-/g, '/'))      // 兼容 iOS
    }));

    return allSlots.map(slot => {
      let isAvailable = true;
      for (const booked of bookedRanges) {
        // 检查时间段 [slot.startDateTime, slot.endDateTime)
        // 是否与预订时间段 [booked.start, booked.end) 有重叠
        // 重叠条件: slot.startDateTime < booked.end && slot.endDateTime > booked.start
        if (slot.startDateTime < booked.end && slot.endDateTime > booked.start) {
          isAvailable = false;
          break; // 一旦发现重叠，该时间段就不可用
        }
      }
      return { ...slot, available: isAvailable };
    });
  },

  // 选择时间段
  selectTimeSlot(e) {
    const { id, time, available } = e.currentTarget.dataset;
    // console.log(id, time, available);
    if (available) {
      this.setData({
        selectedTimeSlotId: id,
        selectedTimeRange: time
      });
    } else {
      wx.showToast({
        title: '该时段已被预约',
        icon: 'none'
      });
    }
  },

  // 输入预约目的
  bindPurposeInput(e) {
    this.setData({
      purpose: e.detail.value
    });
  },

  // 提交预约
  submitBooking() {
    if (!this.data.selectedTimeSlotId) {
      wx.showToast({ title: '请选择预约时间段', icon: 'none' });
      return;
    }
    if (!this.data.purpose.trim()) {
      wx.showToast({ title: '请输入预约目的', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在预约...' });

    const bookingData = {
      labId: this.data.labId,
      date: this.data.selectedDate,
      timeRange: this.data.selectedTimeRange, // 例如 "09:00 - 09:30"
      // 可能需要发送更精确的开始和结束时间给后端
      // startTime: this.data.availableTimes.find(t => t.id === this.data.selectedTimeSlotId).startDateTime,
      // endTime: this.data.availableTimes.find(t => t.id === this.data.selectedTimeSlotId).endDateTime,
      purpose: this.data.purpose.trim()
    };

    console.log("Submitting booking data:", bookingData);

    // --- 模拟后端请求 ---
    // 在实际应用中，这里应该调用 wx.request 向后端发送 POST 请求
    // wx.request({
    //   url: 'YOUR_BACKEND_API_ENDPOINT/book',
    //   method: 'POST',
    //   data: bookingData,
    //   success: (res) => {
    //     if (res.statusCode === 200 && res.data.success) {
    //       wx.showToast({ title: '预约成功', icon: 'success' });
    //       // 预约成功后的操作，例如返回上一页或跳转到预约列表
    //       setTimeout(() => {
    //         wx.navigateBack();
    //       }, 1500);
    //     } else {
    //       wx.showToast({ title: res.data.message || '预约失败', icon: 'none' });
    //     }
    //   },
    //   fail: (err) => {
    //     console.error("Booking request failed:", err);
    //     wx.showToast({ title: '网络错误，预约失败', icon: 'none' });
    //   },
    //   complete: () => {
    //     wx.hideLoading();
    //   }
    // });
    // --- 模拟结束 ---

    // --- 使用模拟数据代替后端请求 ---
    setTimeout(() => {
      wx.hideLoading();
      // 模拟成功
      wx.showToast({ title: '预约成功 (模拟)', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack(); // 返回上一页
      }, 1500);

      // // 模拟失败
      // wx.showToast({ title: '预约失败 (模拟)', icon: 'none' });

    }, 1000); // 模拟网络延迟
    // --- 模拟数据结束 ---
  },

  // --- 其他生命周期和事件处理函数 ---
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
})