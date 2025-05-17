// pages/reservationmanagement/reservationmanagement.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    currentStatus: '', // 空字符串表示全部状态
    reservations: [], // 所有预约记录
    filteredReservations: [] // 筛选后的预约记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchReservations();
  },

  /**
   * 获取预约记录
   */
  fetchReservations() {
    // API请求部分留空，由你自己实现
    // 示例数据结构
    const mockData = [
      {
        reservationId: '1001',
        userId: 'user123',
        userName: '张三',
        labId: 'lab001',
        labName: '物理实验室A',
        reservationDate: '2025-05-18',
        startTime: '09:00',
        endTime: '11:00',
        status: 'pending',
        remark: '期末实验项目'
      },
      // 更多示例数据...
    ];

    this.setData({
      reservations: mockData,
      filteredReservations: mockData
    });
  },

  /**
   * 处理搜索输入
   */
  handleSearchInput(e) {
    const value = e.detail.value;
    this.setData({
      searchKey: value
    });
  },

  /**
   * 确认搜索
   */
  handleSearchConfirm(e) {
    const value = e.detail.value;
    this.filterReservations(value, this.data.currentStatus);
  },

  /**
   * 清空搜索
   */
  clearSearch() {
    this.setData({
      searchKey: ''
    });
    this.filterReservations('', this.data.currentStatus);
  },

  /**
   * 按状态筛选
   */
  filterByStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      currentStatus: status
    });
    this.filterReservations(this.data.searchKey, status);
  },

  /**
   * 筛选预约记录
   */
  filterReservations(keyword, status) {
    let filtered = this.data.reservations;
    
    // 关键词筛选
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.reservationId.toLowerCase().includes(lowerKeyword) || 
        item.userName.toLowerCase().includes(lowerKeyword) ||
        item.labName.toLowerCase().includes(lowerKeyword)
      );
    }
    
    // 状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }
    
    this.setData({
      filteredReservations: filtered
    });
  },

  /**
   * 确认预约
   */
  confirmReservation(e) {
    const reservationId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认预约',
      content: '确定要批准此预约申请吗？',
      success: (res) => {
        if (res.confirm) {
          // API请求部分留空，由你自己实现
          wx.showLoading({
            title: '处理中...',
          });
          
          // 模拟API请求成功
          setTimeout(() => {
            // 更新本地数据状态
            this.updateReservationStatus(reservationId, 'confirmed');
            
            wx.hideLoading();
            wx.showToast({
              title: '已确认预约',
              icon: 'success'
            });
          }, 500);
        }
      }
    });
  },

  /**
   * 拒绝预约
   */
  rejectReservation(e) {
    const reservationId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '拒绝预约',
      content: '确定要拒绝此预约申请吗？',
      confirmColor: '#ea4335',
      success: (res) => {
        if (res.confirm) {
          // API请求部分留空，由你自己实现
          wx.showLoading({
            title: '处理中...',
          });
          
          // 模拟API请求成功
          setTimeout(() => {
            // 更新本地数据状态
            this.updateReservationStatus(reservationId, 'rejected');
            
            wx.hideLoading();
            wx.showToast({
              title: '已拒绝预约',
              icon: 'success'
            });
          }, 500);
        }
      }
    });
  },

  /**
   * 更新预约状态（本地数据）
   */
  updateReservationStatus(reservationId, newStatus) {
    // 更新reservations数组中的状态
    const reservations = this.data.reservations.map(item => {
      if (item.reservationId === reservationId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    
    // 更新filteredReservations数组中的状态
    const filteredReservations = this.data.filteredReservations.map(item => {
      if (item.reservationId === reservationId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    
    this.setData({
      reservations,
      filteredReservations
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时重新获取数据，以防数据更新
    this.fetchReservations();
  }
})