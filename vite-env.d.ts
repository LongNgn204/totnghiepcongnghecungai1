/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly MODE: string;
  // Thêm các env variables khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
