/// <reference types="vite/client" />

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: {
    name: string
    el: Record<string, string | string[] | Record<string, string>>
  }
  export default locale
}
