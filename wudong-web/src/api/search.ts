import request from '@/utils/request'

export interface SearchResult {
  products: any[]
  restaurants: any[]
  homestays: any[]
  attractions: any[]
}

// 全局搜索
export function globalSearch(keyword: string, type?: string) {
  return request.post<SearchResult>('/app/search/global', { keyword, type })
}

// 搜索建议
export function searchSuggest(keyword: string) {
  return request.post<string[]>('/app/search/suggest', { keyword })
}
