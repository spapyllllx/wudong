const api = require('../../utils/api');

Page({
  data: {
    banners: [],
    categories: [],
    hotList: [],
    list: [],
    keyword: '',
    query: { page: 1, size: 10, category_id: 0, sort: 'time' },
    hasMore: true,
    navColors: ['#e54d42', '#e6a23c', '#67c23a', '#1989fa', '#8e2f2f']
  },

  onLoad() {
    this.loadCategories();
    this.loadBanners();
    this.loadHot();
    this.load();
  },

  onPullDownRefresh() {
    this.setData({ 'query.page': 1, hasMore: true });
    this.loadBanners();
    this.loadHot();
    this.load(() => wx.stopPullDownRefresh());
  },

  async loadBanners() {
    try {
      const res = await api.get('/clothing/banner/list');
      this.setData({ banners: res || [] });
    } catch (e) {}
  },

  async loadHot() {
    try {
      const res = await api.productList({ page: 1, size: 6, sort: 'sales' });
      this.setData({ hotList: res.list || [] });
    } catch (e) {}
  },

  async loadCategories() {
    try {
      const res = await api.categories();
      this.setData({ categories: (res || []).slice(0, 5) });
    } catch (e) {}
  },

  async load(cb) {
    try {
      const params = { ...this.data.query };
      if (this.data.keyword) params.keyword = this.data.keyword;
      const res = await api.productList(params);
      const list = this.data.query.page === 1 ? res.list : this.data.list.concat(res.list);
      this.setData({ list, hasMore: list.length < res.pagination.total });
    } catch (e) {
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    } finally {
      cb && cb();
    }
  },

  goBanner(e) {
    const item = e.currentTarget.dataset.item;
    if (item.link_type === 'product' && item.link_value) {
      wx.navigateTo({ url: '/pages/detail/detail?id=' + item.link_value });
    }
  },

  onKeyword(e) {
    this.setData({ keyword: e.detail.value });
  },
  doSearch() {
    this.setData({ 'query.page': 1 });
    this.load();
  },
  setCat(e) {
    const id = Number(e.currentTarget.dataset.id);
    this.setData({ 'query.category_id': id, 'query.page': 1 });
    this.load();
    wx.pageScrollTo({ scrollTop: 300 });
  },
  setSort(e) {
    this.setData({ 'query.sort': e.currentTarget.dataset.sort, 'query.page': 1 });
    this.load();
  },
  loadMore() {
    if (!this.data.hasMore) return;
    this.setData({ 'query.page': this.data.query.page + 1 });
    this.load();
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  }
});
