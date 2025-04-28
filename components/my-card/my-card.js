// components/my-card/my-card.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: String,       // 卡片标题
    thumb: String,       // 缩略图 URL
    hover: {             // 是否启用悬停效果
      type: Boolean,
      value: true
    }
  }
});