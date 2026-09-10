/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 基地址，如 http://localhost:8001 */
  readonly VITE_API_BASE_URL: string
  /** 演示数据开关：'true' 时对后端尚未实现的模块启用本地 mock */
  readonly VITE_ENABLE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
