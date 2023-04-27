import Koa from 'koa'

import type { ISubscriptionParams } from '~/types/subscription'

export class MyKoa extends Koa {
  on<T extends keyof ISubscriptionParams>(event: T, listener: (...args: ISubscriptionParams[T]) => void) {
    return super.on(event, <any>listener)
  }

  emit<T extends keyof ISubscriptionParams>(event: T, ...args: ISubscriptionParams[T]) {
    return super.emit(event, ...args)
  }
}
