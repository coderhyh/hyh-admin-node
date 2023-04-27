import { Context, Next } from 'koa'

import { getDataType } from '~/common/utils'
import errorTypes from '~/constants/error-types'

class VerifyMiddleware {
  requiredField(requiredField: string[]) {
    return async (ctx: Context, next: Next) => {
      try {
        const body = ctx.request.body ?? {}
        const params = ctx.params ?? {}
        const query = ctx.query ?? {}
        const data = { ...body, ...params, ...query }

        const fieldName: string | undefined = ctx.file?.fieldName
        fieldName && (data[fieldName] = fieldName)

        const lackData = requiredField.filter((e) => !data[e] === undefined)
        const errorMsg = errorTypes.PARAMETER_MISSIMG

        lackData.length
          ? ctx.app.emit('error', { ...errorMsg, msg: errorMsg.msg + lackData.join(',') }, ctx)
          : await next()
      } catch (err) {
        console.log(err)
      }
    }
  }

  requiredFieldType(fieldListType: App.IFieldListType[]) {
    return async (ctx: Context, next: Next) => {
      try {
        const body = ctx.request.body ?? {}
        const params = ctx.params ?? {}
        const query = ctx.query ?? {}
        const data = { ...body, ...params, ...query }
        const fieldName: string | undefined = ctx.file?.fieldName
        fieldName && (data[fieldName] = fieldName)

        const flag = fieldListType.every((it) =>
          data[it.field] !== undefined ? it.types.includes(getDataType(data[it.field])) : it.isOptional
        )

        flag ? await next() : ctx.app.emit('error', errorTypes.BAD_REQUEST, ctx)
      } catch (err) {
        console.log(err)
        ctx.app.emit('error', errorTypes.SERVER_ERROR, ctx)
      }
    }
  }
}

export const { requiredField, requiredFieldType } = new VerifyMiddleware()
