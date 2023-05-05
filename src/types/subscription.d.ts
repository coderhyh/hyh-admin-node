import type { Context } from 'koa'

import errorTypes from '~/constants/error-types'

type errorTypesKey = keyof typeof errorTypes

export type errorTypesItem = (typeof errorTypes)['PARAMETER_MISSIMG']

export interface ISubscriptionParams {
  error: [errorMessage: errorTypesItem & { [k: string]: any }, ctx: Context, customErrorMsg?: string]
}
