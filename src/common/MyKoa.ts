import Koa from 'koa'

import type { IErrorParams } from '~/types/errorTypes'

export class MyKoa extends Koa {
  on<T extends keyof IErrorParams>(event: T, listener: (...args: IErrorParams[T]) => void) {
    return super.on(event, <any>listener)
  }

  emit<T extends keyof IErrorParams>(event: T, ...args: IErrorParams[T]) {
    return super.emit(event, ...args)
  }
}
