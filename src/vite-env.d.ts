/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DRIZZLE_DATABASE_URL: string;
    readonly VITE_FIREBASE_API_KEY: string;
    // add other VITE_ variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }