declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    SERVER_TOKEN: string;
    CLIENT_TOKEN: string;
  }
}
