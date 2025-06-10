const app = getApp();

Page({
  data: {
    notices: [], // 公告列表
    showAddPopup: false, // 添加公告弹窗
    apiurl: app.globalData.apiurl,
    noticeTextInput: '' // 新增：用于绑定 textarea 的输入内容
  },

  onLoad(options) {
    this.fetchNotices();
  },

  fetchNotices() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: this.data.apiurl + 'notice',
      method: 'GET',
      success: (res) => {
        console.log("API返回数据:", res.data);
        if (res.statusCode === 200) {
          this.setData({
            notices: res.data.data || [] // 确保 notices 是一个数组
          });
        } else {
          this.setData({ notices: [] }); // 请求失败或数据格式不符时，设置为空数组
          wx.showToast({ title: res.data.message || '加载公告失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error("API请求失败:", err);
        this.setData({ notices: [] });
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
        wx.stopPullDownRefresh(); // 停止下拉刷新动画
      }
    });
  },

  openAddNoticePopup() {
    this.setData({
      showAddPopup: true,
      noticeTextInput: '' // 打开弹窗时清空上次输入的内容
    });
  },

  closeAddPopup() {
    this.setData({ showAddPopup: false });
  },

  onPopupChange(e) {
    this.setData({ showAddPopup: e.detail.visible });
  },

  // 新的提交方法，通过 bind:tap 触发
  handleManualSubmit() {
    const noticeText = this.data.noticeTextInput; // 直接从 data 中获取输入内容

    if (!noticeText || !noticeText.trim()) {
      wx.showToast({ title: '请填写公告内容', icon: 'none' });
      return;
    }

    const dataToSubmit = {
      noticeText: noticeText.trim()
    };

    wx.showLoading({ title: '提交中...' });
    wx.request({
      url: this.data.apiurl + 'notice/add',
      method: 'POST',
      data: dataToSubmit,
      success: (res) => {
        console.log("提交公告返回:", res);
        if (res.statusCode === 200 && res.data && res.data.code === 200) { // 假设后端成功code为200
          wx.showToast({ title: '添加成功', icon: 'success' });
          this.closeAddPopup();
          this.fetchNotices(); // 刷新列表
        } else {
          wx.showToast({ title: (res.data && res.data.message) || '操作失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error("提交公告失败:", err);
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // submitNoticeForm(e) { // 这个方法现在不再被使用，可以注释或删除
  //   const { noticeText } = e.detail.value;
  //   // ... 原有逻辑
  // },

  handleDeleteNotice(e) {
    const noticeId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条公告吗？此操作不可恢复。',
      confirmColor: '#ea4335',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });
          wx.request({
            url: `${this.data.apiurl}notice/${noticeId}/delete`, // 使用模板字符串
            method: 'DELETE',
            success: (delRes) => {
              console.log("删除公告返回:", delRes);
              if (delRes.statusCode === 200 && delRes.data && delRes.data.code === 200) { // 假设后端成功code为200
                wx.showToast({ title: '删除成功', icon: 'success' });
                this.fetchNotices(); // 刷新列表
              } else {
                wx.showToast({ title: (delRes.data && delRes.data.message) || '删除失败', icon: 'none' });
              }
            },
            fail: (err) => {
              console.error("删除公告失败:", err);
              wx.showToast({ title: '网络请求失败', icon: 'none' });
            },
            complete: () => {
              wx.hideLoading();
            }
          });
        }
      }
    });
  },

  onPullDownRefresh() {
    this.fetchNotices();
  }
});