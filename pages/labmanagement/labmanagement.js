const app = getApp();

Page({
  data: {
    searchKey: '',
    labs: [], // 原始实验室列表
    filteredLabs: [], // 过滤后的实验室列表
    showAddEditPopup: false,
    isEditMode: false,
    labForm: { // 表单数据
      labId: null,
      labName: '',
      labLocation: '',
      labCapacity: '',
      labStatus: 'available', // 默认状态
      labDescription: '',
      labOpentime: '',
      labClosetime: ''
    },
    apiurl: ''
  },

  onLoad(options) {
    // 初始化数据
    this.initData();
    this.fetchLabs();
  },

  // 初始化数据方法
  initData() {
    this.setData({
      apiurl: app.globalData.apiurl || '',
      labStatusOptions: [
        { label: '可用', value: 'available' },
        { label: '维护中', value: 'maintenance' },
        { label: '已占用', value: 'occupied' },
        { label: '不可用', value: 'unavailable' }
      ]
    });
  },

  fetchLabs() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: this.data.apiurl + 'lab',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          console.log(res);
          this.setData({
            labs: res.data.data || [],
            filteredLabs: res.data.data || []
          });
        } else {
          wx.showToast({ title: res.data.message || '获取实验室列表失败', icon: 'none' });
          this.setData({ labs: [], filteredLabs: [] });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        this.setData({ labs: [], filteredLabs: [] });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  handleSearchInput(e) {
    const value = e.detail.value;
    this.setData({ searchKey: value });
    this.filterLabs(value);
  },

  handleSearchConfirm() {
    this.filterLabs(this.data.searchKey);
  },

  filterLabs(keyword) {
    const lowerKeyword = keyword.toLowerCase().trim();
    if (!lowerKeyword) {
      this.setData({ filteredLabs: this.data.labs });
      return;
    }
    const filtered = this.data.labs.filter(lab => {
      return (lab.labName && lab.labName.toLowerCase().includes(lowerKeyword)) ||
             (lab.labLocation && lab.labLocation.toLowerCase().includes(lowerKeyword));
    });
    this.setData({ filteredLabs: filtered });
  },

  clearSearch() {
    this.setData({
      searchKey: '',
      filteredLabs: this.data.labs
    });
  },

  formatLabStatus(statusValue) {
    const options = this.data.labStatusOptions || [];
    const option = options.find(opt => opt.value === statusValue);
    return option ? option.label : '未知';
  },

  // 验证时间格式
  validateTimeFormat(time) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return timeRegex.test(time);
  },

  // --- 弹窗相关 ---
  openAddLabPopup() {
    this.setData({
      isEditMode: false,
      labForm: {
        labId: null,
        labName: '',
        labLocation: '',
        labCapacity: '',
        labStatus: 'available', // 新建时默认为可用状态
        labDescription: '',
        labOpentime: '',
        labClosetime: ''
      },
      showAddEditPopup: true
    });
  },

  openEditLabPopup(e) {
    const labId = e.currentTarget.dataset.id;
    const labToEdit = this.data.labs.find(lab => lab.labId === labId);
    
    if (!labToEdit) {
      wx.showToast({ title: '找不到要编辑的实验室', icon: 'none' });
      return;
    }

    this.setData({
      isEditMode: true,
      labForm: { ...labToEdit },
      showAddEditPopup: true
    });
  },

  closeAddEditPopup() {
    this.setData({ showAddEditPopup: false });
  },

  onPopupChange(e) {
    this.setData({ showAddEditPopup: e.detail.visible });
  },

  submitLabForm(e) {
    const formData = e.detail.value;
    const { labName, labLocation, labCapacity, labDescription, labOpentime, labClosetime } = formData;

    if (!labName || !labLocation || !labCapacity || !labOpentime || !labClosetime) {
      wx.showToast({ title: '请填写所有必填项', icon: 'none' });
      return;
    }
    
    if (isNaN(parseInt(labCapacity)) || parseInt(labCapacity) <= 0) {
      wx.showToast({ title: '实验室容量必须为正整数', icon: 'none' });
      return;
    }

    // 验证时间格式
    if (!this.validateTimeFormat(labOpentime)) {
      wx.showToast({ title: '开放时间格式不正确，请使用 HH:MM:SS 格式', icon: 'none' });
      return;
    }

    if (!this.validateTimeFormat(labClosetime)) {
      wx.showToast({ title: '关闭时间格式不正确，请使用 HH:MM:SS 格式', icon: 'none' });
      return;
    }

    const dataToSubmit = {
      labName: labName.trim(),
      labLocation: labLocation.trim(),
      labCapacity: parseInt(labCapacity),
      labDescription: labDescription ? labDescription.trim() : '',
      labOpentime: labOpentime.trim(),
      labClosetime: labClosetime.trim()
    };

    let url = this.data.apiurl + 'lab/add';
    let method = 'POST';

    if (this.data.isEditMode && this.data.labForm.labId) {
      url = this.data.apiurl + 'lab/' + this.data.labForm.labId + '/update';
      dataToSubmit.labId = this.data.labForm.labId;
      // 编辑模式不包含状态字段
    } else {
      // 添加模式：默认设置状态为可用
      dataToSubmit.labStatus = 'available';
    }
    
    wx.showLoading({ title: '提交中...' });
    wx.request({
      url: url,
      method: method,
      data: dataToSubmit,
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          wx.showToast({ title: this.data.isEditMode ? '更新成功' : '添加成功', icon: 'success' });
          this.closeAddEditPopup();
          this.fetchLabs();
        } else {
          wx.showToast({ title: res.data.message || '操作失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  handleDeleteLab(e) {
    const labId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个实验室吗？此操作不可恢复。',
      confirmColor: '#ea4335',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });
          wx.request({
            url: this.data.apiurl + 'lab/' + labId + '/delete',
            method: 'DELETE',
            success: (delRes) => {
              if (delRes.statusCode === 200 && delRes.data.code === 200) {
                wx.showToast({ title: '删除成功', icon: 'success' });
                this.fetchLabs();
              } else {
                wx.showToast({ title: delRes.data.message || '删除失败', icon: 'none' });
              }
            },
            fail: () => {
              wx.showToast({ title: '网络请求失败', icon: 'none' });
            },
            complete: () => {
              wx.hideLoading();
            }
          });
        }
      }
    });
  }
});