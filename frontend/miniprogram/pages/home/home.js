// 首页
const app = getApp()

Page({
  data: {
    banners: [],
    hotProducts: [],
    announcement: ''
  },

  onLoad() {
    this.loadBanners();
    this.loadHotProducts();
    this.loadAnnouncement();
  },

  onShow() {
    // 每次显示时刷新数据
  },

  loadBanners() {
    app.request('/api/common/banners')
      .then(res => {
        if (res.code === 200) {
          this.setData({ banners: res.data || [] });
        }
      })
      .catch(err => console.log('轮播图加载失败', err));
  },

  loadHotProducts() {
    // 临时使用示例数据，实际应调用推荐接口
    const products = [
      { type: 'yi', id: 1, title: '苗族银饰手镯', image: '/static/images/default-product.png', price: '299' },
      { type: 'shi', id: 1, title: '苗家腊肉', image: '/static/images/default-product.png', price: '68' },
      { type: 'zhu', id: 1, title: '吊脚楼民宿', image: '/static/images/default-homestay.png', price: '280' },
      { type: 'xing', id: 1, title: '苗寨一日游', image: '/static/images/default-route.png', price: '128' }
    ];
    this.setData({ hotProducts: products });
  },

  loadAnnouncement() {
    app.request('/api/admin/announcements?status=1&limit=1')
      .then(res => {
        if (res.code === 200 && res.data.list && res.data.list.length > 0) {
          this.setData({ announcement: res.data.list[0].title });
        }
      })
      .catch(() => {});
  },

  onBannerTap(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url });
    }
  },

  goToModule(e) {
    const type = e.currentTarget.dataset.type;
    const map = {
      yi: '/pages/yi/list/list',
      shi: '/pages/shi/restaurants/restaurants',
      zhu: '/pages/zhu/homestays/homestays',
      xing: '/pages/xing/scenics/scenics',
      shequ: '/pages/shequ/logs/logs'
    };
    wx.switchTab({ url: map[type] || '/pages/home/home' });
  },

  goToDetail(e) {
    const { type, id } = e.currentTarget.dataset;
    // TODO: 跳转到详情
    wx.showToast({ title: '功能开发中', icon: 'none' });
  }
});
