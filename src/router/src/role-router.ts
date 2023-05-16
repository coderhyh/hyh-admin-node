import Router from 'koa-router'

import {
  createRole,
  deleteRole,
  getRoleList,
  getRoleListSelect,
  updateRoleInfo,
  updateRoleStatus
} from '~/interface/role-interface'
import { verifyPermission, verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'
import {
  verifyDeleteRoleGrade,
  verifyRoleIsDelete,
  verifyRoleIsExist,
  verifyUpdateRoleGrade
} from '~/middleware/role-middleware'
import { requiredField, requiredFieldType, verifyOrderIsLegal } from '~/middleware/verify-middleware'

import { roleFieldType } from '../config/role-config'

const roleRouter = new Router({ prefix: '/role' })

roleRouter.post(
  '/create',
  requiredField(['role_name', 'role_alias', 'status', 'grade', 'permissionList']),
  requiredFieldType(roleFieldType.updateRole),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/role-manage', 'table', 'insert'),
  verifyRoleIsExist,
  createRole
)

roleRouter.post(
  '/list',
  requiredFieldType(roleFieldType.roleList),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/role-manage', 'table', 'query'),
  verifyOrderIsLegal([
    'id',
    'role_name',
    'role_alias',
    'grade',
    'create_by',
    'update_by',
    'create_time',
    'update_time'
  ]),
  getRoleList
)

roleRouter.get('/list-select', verifyTokenExist, verifyTokenInvalid, getRoleListSelect)

roleRouter.patch(
  '/:roleId',
  requiredField(['role_name', 'role_alias', 'status', 'grade', 'permissionList']),
  requiredFieldType(roleFieldType.updateRole),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/role-manage', 'table', 'update'),
  verifyUpdateRoleGrade,
  updateRoleInfo
)

roleRouter.patch(
  '/status/:roleId',
  requiredField(['status']),
  requiredFieldType(roleFieldType.updateRoleStatus),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/role-manage', 'table', 'update'),
  verifyUpdateRoleGrade,
  updateRoleStatus
)

roleRouter.delete(
  '/delete-role',
  requiredField(['roleIds']),
  requiredFieldType(roleFieldType.deleteRole),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/role-manage', 'table', 'delete'),
  verifyDeleteRoleGrade,
  verifyRoleIsDelete,
  deleteRole
)

module.exports = roleRouter
