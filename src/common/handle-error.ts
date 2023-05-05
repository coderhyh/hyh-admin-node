import type { Context } from 'koa'

import type { errorTypesItem } from '~/types/subscription'

export const handleError = (errorMessage: errorTypesItem, ctx: Context) => {
  const status = errorMessage.code ?? 404
  const msg = errorMessage.message ?? 'NOT FOUND'
  ctx.status = status
  ctx.body = {
    ...errorMessage,
    code: status,
    message: msg
  }
}
