/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIX_KEY: string;
  readonly VITE_PIX_NAME: string;
  readonly VITE_PIX_CITY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  /** @deprecated Prefer VITE_SUPABASE_PUBLISHABLE_KEY */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
