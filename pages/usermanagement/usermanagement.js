// pages/usermanagement/usermanagement.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    users: [],
    filterusers: [],
    showEditPopup: false,
    editUserForm: {
      userId: '',
      userName: '',
      userRole: 'user',
      userPassword: ''
    },
    adminRole: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const url = app.globalData.apiurl;
    wx.request({
      url: url + 'user',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.handleOriginalData(res.data.data);
        }
      }
    });
    this.setData({
      adminRole: app.globalData.userrole
    });
  },

  handleOriginalData(data) {
    const role = app.globalData.userrole;
    let fit = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.userRole == "user" || (role == "superadmin" && item.userRole == "admin")) {
        fit.push(item);
      }
    }
    this.setData({
      users: fit
    });
    this.filterUsers(this.data.searchKey);
    // console.log(this.data.users);
  },

  handleSearchInput(e) {
    const value = e.detail.value;
    this.setData({
      searchKey: value
    });
  },

  // 确认搜索
  handleSearchConfirm(e) {
    const value = e.detail.value;
    this.filterUsers(value);
  },

  // 过滤用户数据
  filterUsers(keyword) {
    if (!keyword) {
      this.setData({
        filterusers: this.data.users
      });
      return;
    }
    const users = this.data.user;
    const lowerKeyword = keyword.toLowerCase();

    const filtered = users.filter(user => {
      // 搜索用户ID和用户名
      return user.userId.toLowerCase().includes(lowerKeyword) ||
        user.userName.toLowerCase().includes(lowerKeyword);
    });

    this.setData({
      filterusers: filtered
    });
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchKey: '',
      filterusers: []
    });
  },

  handleEditUser(e) {
    const userId = e.currentTarget.dataset.id;

    // 查找当前用户数据
    const user = this.data.filterusers.find(user => user.userId === userId);

    if (user) {
      // 设置表单初始值
      this.setData({
        editUserForm: {
          userId: user.userId,
          userName: user.userName,
          userRole: user.userRole
        },
        showEditPopup: true
      });
    }
  },

  // 关闭弹窗
  closeEditPopup() {
    this.setData({
      showEditPopup: false
    });
  },

  // 处理弹窗可见性变化
  onPopupChange(e) {
    if (!e.detail.visible) {
      this.setData({
        showEditPopup: false
      });
    }
  },

  // 处理输入框变化
  onInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset;
    this.setData({
      [`editUserForm.${field}`]: e.detail.value
    });
  },

  // 处理角色选择变化
  onRoleChange(e) {
    this.setData({
      'editUserForm.userRole': e.detail.value
    });
  },

  setUserRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({
      'editUserForm.userRole': role
    });
  },
  
  // 删除用户方法
  handleDeleteUser(e) {
    const userId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      confirmColor: '#ea4335',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.apiurl + 'user/' + userId,
            method: 'DELETE',
            success: (res) => {
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                this.onLoad();
                this.setData({
                  showEditPopup: false
                });
              }
            }
          })
        }
      }
    });
  },

  // 提交表单
  submitEditForm() {
    const {
      userId,
      userName,
      userRole,
      userPassword
    } = this.data.editUserForm;

    // 这里添加你的表单验证逻辑
    if (!userName.trim()) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: app.globalData.apiurl + 'user/' + userId,
      method: 'PUT',
      data: {
        "userId": userId,
        "userName": userName,
        "userPassword": userPassword
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
          this.onLoad();
          this.setData({
            showEditPopup: false
          });
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        });
      }
    })
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