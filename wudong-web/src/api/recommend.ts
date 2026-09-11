import request from '@/utils/request'

export interface HomeRecommend {
  hotProducts: any[]
  hotRestaurants: any[]
  hotHomestays: any[]
  hotAttractions: any[]
}

// 首页推荐
export function getHomeRecommend() {
  return request.post<HomeRecommend>('/app/recommend/home')
}
