import http from '@/utils/request'

/**
 * 文章列表查询参数
 */
export interface ArticleQueryParams {
  page: number
  pageSize: number
  keyword?: string
  categoryId?: number
  status?: string
}

/**
 * 文章信息
 */
export interface Article {
  id: number
  title: string
  content: string
  author: string
  category: string
  status: string
  createTime: string
  updateTime: string
}

/**
 * 文章列表响应
 */
export interface ArticleListResponse {
  list: Article[]
  total: number
  page: number
  pageSize: number
}

export const articleApi = {
  /**
   * 获取文章列表
   */
  getList(params: ArticleQueryParams): Promise<ArticleListResponse> {
    return http.get('/article/list', params as unknown as Record<string, unknown>)
  },

  /**
   * 获取文章详情
   */
  getDetail(id: number): Promise<Article> {
    return http.get(`/article/detail/${id}`)
  },

  /**
   * 创建文章
   */
  create(data: Partial<Article>): Promise<Article> {
    return http.post('/article/create', data, { showSuccess: true })
  },

  /**
   * 更新文章
   */
  update(id: number, data: Partial<Article>): Promise<void> {
    return http.put(`/article/update/${id}`, data, { showSuccess: true })
  },

  /**
   * 删除文章
   */
  delete(id: number): Promise<void> {
    return http.delete(`/article/delete/${id}`, { showSuccess: true })
  },

  /**
   * 发布文章
   */
  publish(id: number): Promise<void> {
    return http.post(`/article/publish/${id}`, {}, { showSuccess: true })
  },

  /**
   * 取消发布
   */
  unpublish(id: number): Promise<void> {
    return http.post(`/article/unpublish/${id}`, {}, { showSuccess: true })
  },
}