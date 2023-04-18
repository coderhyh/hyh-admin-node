export {}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      APP_PROD: string
      MYSQL_HOST: string
      MYSQL_PORT: string
      MYSQL_DATABASE: string
      MYSQL_USER: string
      MYSQL_PASSWORD: string
      PRIVATE_KEY: string
      PUBLIC_KEY: string
    }
  }
}
