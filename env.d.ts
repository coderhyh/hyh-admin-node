import { ISubscriptionParams } from '~/types/subscription'

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
  interface Array<T> {
    trim: (this: T[]) => T[]
  }
}

declare module 'koa' {
  interface Application {
    emit: <T extends keyof ISubscriptionParams>(event: T, ...args: ISubscriptionParams[T]) => void
  }
}
