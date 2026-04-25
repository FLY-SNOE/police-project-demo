import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应数据接口
export interface ResponseData<T = unknown> {
  code: number
  message: string
  data: T
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  showError?: boolean // 是否显示错误提示，默认 true
  showSuccess?: boolean // 是否显示成功提示
  skipAuth?: boolean // 是否跳过 token 验证
}

class HttpRequest {
  private instance: AxiosInstance
  private baseURL: string
  private timeout: number

  constructor() {
    // 从环境变量读取配置
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
    this.timeout = 15000

    // 创建 axios 实例
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
    })

    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token')

        if (token && config.headers) {
          // 添加 token 到请求头
          config.headers['Authorization'] = `Bearer ${token}`
        }

        // 可以在这里添加其他请求头配置
        if (config.headers) {
          config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        }

        return config
      },
      (error: unknown) => {
        console.error('请求错误:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        const { code, message } = response.data

        // 根据业务状态码处理
        if (code === 200 || code === 0) {
          // 请求成功
          const config = response.config as RequestConfig
          if (config.showSuccess) {
            ElMessage.success(message || '操作成功')
          }
          return response
        } else if (code === 401) {
          // 未授权，跳转到登录页
          ElMessageBox.alert('登录已过期，请重新登录', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
          }).then(() => {
            // 清除 token
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            // 跳转到登录页
            window.location.href = '/login'
          })
          return Promise.reject(new Error(message || '未授权'))
        } else if (code === 403) {
          // 无权限
          ElMessage.error(message || '无权限访问')
          return Promise.reject(new Error(message || '无权限访问'))
        } else if (code === 404) {
          // 请求资源不存在
          ElMessage.error(message || '请求的资源不存在')
          return Promise.reject(new Error(message || '请求的资源不存在'))
        } else if (code === 500) {
          // 服务器错误
          ElMessage.error(message || '服务器错误')
          return Promise.reject(new Error(message || '服务器错误'))
        } else {
          // 其他错误
          const config = response.config as RequestConfig
          if (config.showError !== false) {
            ElMessage.error(message || '请求失败')
          }
          return Promise.reject(new Error(message || '请求失败'))
        }
      },
      (error: unknown) => {
        console.error('响应错误:', error)

        const axiosError = error as {
          config?: RequestConfig
          response?: {
            status: number
            data?: { message?: string }
          }
          request?: unknown
        }

        const config = axiosError.config

        // 处理 HTTP 错误状态码
        if (axiosError.response) {
          const { status, data } = axiosError.response

          switch (status) {
            case 400:
              ElMessage.error(data?.message || '请求参数错误')
              break
            case 401:
              ElMessageBox.alert('登录已过期，请重新登录', '提示', {
                confirmButtonText: '确定',
                type: 'warning',
              }).then(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                window.location.href = '/login'
              })
              break
            case 403:
              ElMessage.error(data?.message || '无权限访问')
              break
            case 404:
              ElMessage.error(data?.message || '请求的资源不存在')
              break
            case 500:
              ElMessage.error(data?.message || '服务器内部错误')
              break
            case 502:
              ElMessage.error('网关错误')
              break
            case 503:
              ElMessage.error('服务不可用')
              break
            case 504:
              ElMessage.error('网关超时')
              break
            default:
              if (config?.showError !== false) {
                ElMessage.error(data?.message || '请求失败')
              }
          }
        } else if (axiosError.request) {
          // 请求已发出但没有收到响应
          if (config?.showError !== false) {
            ElMessage.error('网络连接失败，请检查网络设置')
          }
        } else {
          // 请求配置出错
          if (config?.showError !== false) {
            ElMessage.error((error as Error).message || '请求配置错误')
          }
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 请求配置
   */
  public get<T = unknown>(url: string, params?: Record<string, unknown>, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, { ...config, params })
  }

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 请求配置
   */
  public post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 请求配置
   */
  public put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config 请求配置
   */
  public delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求体数据
   * @param config 请求配置
   */
  public patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  /**
   * 文件上传
   * @param url 请求地址
   * @param file 文件对象
   * @param config 请求配置
   */
  public upload<T = unknown>(url: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * 文件下载
   * @param url 请求地址
   * @param params 请求参数
   * @param filename 下载文件名
   */
  public download(url: string, params?: Record<string, unknown>, filename?: string): Promise<void> {
    return this.instance
      .get(url, {
        params,
        responseType: 'blob',
      })
      .then((response: AxiosResponse<Blob>) => {
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename || 'download'
        link.click()
        URL.revokeObjectURL(link.href)
      })
  }
}

// 创建请求实例
const http = new HttpRequest()

export default http