# HTTP 请求模块使用指南

## 目录结构

```
src/
├── api/                    # API 接口定义
│   ├── auth.ts            # 认证相关接口
│   └── article.ts         # 文章相关接口
├── utils/
│   └── request.ts         # Axios 封装
└── types/
    └── common.ts          # 通用类型定义
```

## 功能特性

### 1. 自动 Token 管理
- 自动从 localStorage 读取 token
- 自动在请求头添加 `Authorization` 字段

### 2. 统一错误处理
- 自动处理各种 HTTP 状态码
- 自动显示错误提示（可配置关闭）
- 自动处理未授权跳转登录

### 3. 请求/响应拦截
- 请求前自动添加 token 和 Content-Type
- 响应后自动解包数据
- 根据业务状态码统一处理

### 4. 完整的 HTTP 方法
- `get<T>(url, params?, config?)` - GET 请求
- `post<T>(url, data?, config?)` - POST 请求
- `put<T>(url, data?, config?)` - PUT 请求
- `delete<T>(url, config?)` - DELETE 请求
- `patch<T>(url, data?, config?)` - PATCH 请求
- `upload<T>(url, file, config?)` - 文件上传
- `download(url, params?, filename?)` - 文件下载

## 使用示例

### 1. 基本使用

```typescript
import http from '@/utils/request'

// GET 请求
const data = await http.get('/api/user/info')

// POST 请求
const result = await http.post('/api/user/create', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// PUT 请求
await http.put('/api/user/update/1', {
  name: '李四'
})

// DELETE 请求
await http.delete('/api/user/delete/1')
```

### 2. 使用 API 模块

```typescript
import { authApi, articleApi } from '@/api'

// 用户登录
const loginResult = await authApi.login({
  username: 'admin',
  password: '123456'
})
console.log(loginResult.token)
console.log(loginResult.userInfo)

// 获取文章列表
const list = await articleApi.getList({
  page: 1,
  pageSize: 10,
  keyword: 'Vue'
})

// 创建文章
await articleApi.create({
  title: '新文章',
  content: '文章内容',
  author: '张三'
})

// 更新文章
await articleApi.update(1, {
  title: '更新后的标题'
})

// 删除文章
await articleApi.delete(1)
```

### 3. 配置选项

```typescript
// 不显示错误提示
await http.get('/api/data', {}, { showError: false })

// 显示成功提示
await http.post('/api/create', data, { showSuccess: true })

// 跳过 token 验证
await http.get('/api/public', {}, { skipAuth: true })
```

### 4. 文件上传

```typescript
const fileInput = document.querySelector('input[type="file"]')
const file = fileInput?.files[0]

if (file) {
  const result = await http.upload('/api/upload', file)
  console.log(result.url)
}
```

### 5. 文件下载

```typescript
await http.download('/api/export', {
  keyword: 'Vue'
}, 'export.xlsx')
```

## 环境变量配置

在 `.env` 文件中配置：

```bash
# API 基础路径
VITE_API_BASE_URL=http://localhost:8080/api

# API 超时时间（毫秒）
VITE_API_TIMEOUT=15000

# 是否启用 Mock 数据
VITE_ENABLE_MOCK=true
```

## 错误处理

HTTP 模块会自动处理以下错误：

### HTTP 状态码
- `400` - 请求参数错误
- `401` - 未授权，自动跳转登录
- `403` - 无权限访问
- `404` - 请求的资源不存在
- `500` - 服务器内部错误
- `502` - 网关错误
- `503` - 服务不可用
- `504` - 网关超时

### 业务状态码
- `200` 或 `0` - 成功
- `401` - 登录过期
- `403` - 无权限
- `404` - 资源不存在
- `500` - 服务器错误

## 类型定义

### ResponseData
```typescript
interface ResponseData<T> {
  code: number      // 业务状态码
  message: string   // 提示信息
  data: T         // 实际数据
}
```

### RequestConfig
```typescript
interface RequestConfig {
  showError?: boolean    // 是否显示错误提示，默认 true
  showSuccess?: boolean // 是否显示成功提示
  skipAuth?: boolean   // 是否跳过 token 验证
}
```

## 最佳实践

1. **统一使用 API 模块**
   - 在 `src/api` 目录下按模块组织接口
   - 导出类型和接口定义
   - 便于复用和维护

2. **使用 TypeScript 类型**
   - 为每个 API 定义明确的类型
   - 利用泛型确保类型安全
   - 避免使用 `any`

3. **错误处理**
   - 在组件中使用 try-catch
   - 根据业务需求决定是否显示错误
   - 可使用 `showError: false` 关闭默认提示

4. **Token 管理**
   - 登录成功后保存 token 到 localStorage
   - 登出时清除 token
   - 模块会自动处理 token 添加

## 示例：在 Vue 组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { articleApi } from '@/api/article'
import type { Article, ArticleListResponse } from '@/api/article'

const articles = ref<Article[]>([])
const loading = ref(false)
const total = ref(0)

const fetchArticles = async () => {
  loading.value = true
  try {
    const result: ArticleListResponse = await articleApi.getList({
      page: 1,
      pageSize: 10
    })
    articles.value = result.list
    total.value = result.total
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<template>
  <div v-loading="loading">
    <el-table :data="articles">
      <!-- 表格内容 -->
    </el-table>
  </div>
</template>
```

## 注意事项

1. Token 名称固定为 `token`，存储在 localStorage 中
2. 所有接口返回格式需统一为 `{ code, message, data }`
3. 开发环境可启用 Mock 数据进行测试
4. 超时时间默认为 15000ms，可根据需要调整