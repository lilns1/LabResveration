// components/swiper/swiper.js
const imageCdn = '/image';
const swiperList = [
  {
    value: `${imageCdn}/1.png`,
    ariaLabel: '图片1',
  },
  {
    value: `${imageCdn}/2.png`,
    ariaLabel: '图片2',
  },
  {
    value: `${imageCdn}/1.png`,
    ariaLabel: '图片1',
  },
  {
    value: `${imageCdn}/2.png`,
    ariaLabel: '图片2',
  },
];

Component({
  data: {
    current: 1,
    autoplay: true,
    duration: 500,
    interval: 5000,
    swiperList,
  },
});
