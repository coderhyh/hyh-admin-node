import type { Context } from 'koa'

import errorTypes from '~/constants/error-types'

type errorTypesKey = keyof typeof errorTypes

export type errorTypesItem = (typeof errorTypes)['PARAMETER_MISSIMG']

export interface IErrorParams {
  error: [errorMessage: errorTypesItem, ctx: Context, customErrorMsg?: string]
  success: [name: string, age: number]
}
