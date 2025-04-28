Component({
  //  组件的属性列表
  properties: { },
  //  组件的初始数据
  data: {
    value: '/pages/index/index',
    tabBar: [{
      value: '/pages/index/index',
      label: '首页',
    }, {
      value: '/pages/home/home',
      label: '我的',
    }]
  },
  //  组件的方法列表
  methods: {
    onChange(e) {
      wx.switchTab({
        url: e.detail.value
      });
    }
  }
})
