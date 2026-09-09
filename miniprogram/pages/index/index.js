const api = require('../../utils/api');

Page({
  data: {
    categories: [],
    list: [],
    keyword: '',
    query: { page: 1, size: 10, category_id: 0, sort: 'time' },
    hasMore: true
  },

  onLoad() {
    this.loadCategories();
    this.load();
  },

  onPullDownRefresh() {
    this.setData({ 'query.page': 1, hasMore: true });
    this.load(() => wx.stopPullDownRefresh());
  },

  async loadCategories() {
    try {
      const res = await api.categories();
      this.setData({ categories: res || [] });
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

  onKeyword(e) {
    this.setData({ keyword: e.detail.value });
  },
  doSearch() {
    this.setData({ 'query.page': 1 });
    this.load();
  },
  setCat(e) {
    this.setData({ 'query.category_id': Number(e.currentTarget.dataset.id), 'query.page': 1 });
    this.load();
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
