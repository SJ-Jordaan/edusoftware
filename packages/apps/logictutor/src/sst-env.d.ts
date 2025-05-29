/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_REGION: string;
  readonly VITE_BUCKET: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_LOGIN_URI: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
