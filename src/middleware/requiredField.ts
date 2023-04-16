import { Context, Next } from 'koa'

import errorTypes from '~/constants/error-types'

export const requiredField = (requiredField: string[]) => {
  return async (ctx: Context, next: Next) => {
    try {
      const data: any = ctx.req.method === 'POST' ? ctx.request.body : ctx.query
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
