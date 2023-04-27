import Router from 'koa-router'

import { getRolePermissionSelect } from '~/interface/permission.interface'
import { verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'

const permissionRouter = new Router({ prefix: '/permission' })

permissionRouter.get('/list-select', verifyTokenExist, verifyTokenInvalid, getRolePermissionSelect)

module.exports = permissionRouter
