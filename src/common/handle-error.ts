import type { Context } from 'koa'

import type { errorTypesItem } from '~/types/subscription'

export const handleError = (errorMessage: errorTypesItem, ctx: Context) => {
  const status = errorMessage.status ?? 404
  const msg = errorMessage.msg ?? 'NOT FOUND'
  ctx.status = status
  ctx.body = {
    code: status,
    message: msg
  }
}
