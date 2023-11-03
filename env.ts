declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATA_DIR: string;
    }
  }
}
export {};
