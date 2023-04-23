import { Context, Next } from 'koa'

import errorTypes from '~/constants/error-types'

export const requiredField = (requiredField: string[]) => {
  return async (ctx: Context, next: Next) => {
    try {
      const body = ctx.request.body ?? {}
      const params = ctx.params ?? {}
      const query = ctx.query ?? {}
      const data = { ...body, ...params, ...query }

      const fieldName: string | undefined = ctx.file?.fieldName
      fieldName && (data[fieldName] = fieldName)

      const lackData = requiredField.filter((e) => !data[e])
      const errorMsg = errorTypes.PARAMETER_MISSIMG

      lackData.length
        ? ctx.app.emit('error', { ...errorMsg, msg: errorMsg.msg + lackData.join(',') }, ctx)
        : await next()
    } catch (err) {
      console.log(err)
    }
  }
}
