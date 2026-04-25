import http from '@/utils/request'

/**
 * 用户登录
 */
export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  role: string
  createTime: string
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
}

export const authApi = {
  /**
   * 用户登录
   */
  login(params: LoginParams): Promise<LoginResult> {
    return http.post('/auth/login', params, { showSuccess: true })
  },

  /**
   * 用户登出
   */
  logout(): Promise<void> {
    return http.post('/auth/logout', {}, { showSuccess: true })
  },

  /**
   * 获取用户信息
   */
  getUserInfo(): Promise<UserInfo> {
    return http.get('/auth/userinfo')
  },

  /**
   * 刷新 Token
   */
  refreshToken(): Promise<{ token: string }> {
    return http.post('/auth/refresh')
  },
}