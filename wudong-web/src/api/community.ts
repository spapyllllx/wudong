import request, { PaginationResponse } from '@/utils/request'

export interface Post {
  id: number
  userId: number
  userNickName: string
  userAvatar: string
  content: string
  images: string[]
  location?: string
  longitude?: number
  latitude?: number
  scenicId?: number
  scenicName?: string
  likeCount: number
  commentCount: number
  viewCount: number
  shareCount: number
  status: number
  isEssence: number
  isTop: number
  createTime: string
  isLiked?: boolean
}

export interface Comment {
  id: number
  postId: number
  userId: number
  userNickName: string
  userAvatar: string
  content: string
  parentId?: number
  replyUserId?: number
  replyUserNickName?: string
  likeCount: number
  createTime: string
  replies?: Comment[]
  isLiked?: boolean
}

export interface PublishPostParams {
  content: string
  images?: string[]
  location?: string
  longitude?: number
  latitude?: number
  scenicId?: number
  scenicName?: string
}

export interface PublishCommentParams {
  postId: number
  content: string
  parentId?: number
  replyUserId?: number
  replyUserNickName?: string
}

/**
 * 获取帖子列表
 */
export function getPostList(page: number = 1, size: number = 10, type?: string) {
  return request.post<PaginationResponse<Post>>('/app/shequ/community/postList', {
    page,
    size,
    type
  })
}

/**
 * 获取帖子详情
 */
export function getPostDetail(id: number) {
  return request.get<Post>('/app/shequ/community/postDetail', { id })
}

/**
 * 发布帖子
 */
export function publishPost(data: PublishPostParams) {
  return request.post<Post>('/app/shequ/community/publishPost', data)
}

/**
 * 删除我的帖子
 */
export function deleteMyPost(id: number) {
  return request.post('/app/shequ/community/deleteMyPost', { id })
}

/**
 * 点赞帖子
 */
export function likePost(postId: number) {
  return request.post('/app/shequ/community/likePost', { postId })
}

/**
 * 取消点赞帖子
 */
export function unlikePost(postId: number) {
  return request.post('/app/shequ/community/unlikePost', { postId })
}

/**
 * 获取评论列表
 */
export function getCommentList(postId: number) {
  return request.post<Comment[]>('/app/shequ/community/commentList', { postId })
}

/**
 * 发表评论
 */
export function publishComment(data: PublishCommentParams) {
  return request.post<Comment>('/app/shequ/community/publishComment', data)
}

/**
 * 删除我的评论
 */
export function deleteMyComment(id: number) {
  return request.post('/app/shequ/community/deleteMyComment', { id })
}

/**
 * 点赞评论
 */
export function likeComment(commentId: number) {
  return request.post('/app/shequ/community/likeComment', { commentId })
}

/**
 * 取消点赞评论
 */
export function unlikeComment(commentId: number) {
  return request.post('/app/shequ/community/unlikeComment', { commentId })
}

/**
 * 我的帖子列表
 */
export function getMyPostList(page: number = 1, size: number = 10) {
  return request.post<PaginationResponse<Post>>('/app/shequ/community/myPostList', {
    page,
    size
  })
}

/**
 * 我点赞的帖子列表
 */
export function getMyLikeList(page: number = 1, size: number = 10) {
  return request.post<PaginationResponse<Post>>('/app/shequ/community/myLikeList', {
    page,
    size
  })
}

/**
 * 获取相关推荐帖子
 */
export function getRecommendPosts(postId: number, limit: number = 5) {
  return request.get<Post[]>('/app/shequ/community/recommendPosts', {
    postId,
    limit
  })
}
