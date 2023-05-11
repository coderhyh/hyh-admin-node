import Router from 'koa-router'

import { createMenu, deleteMenu, getMenu, getMenuTree, getMenuTreeSelect, updateMenu } from '~/interface/menu-interface'
import { verifyPermission, verifyTokenExist, verifyTokenInvalid } from '~/middleware/auth-middleware'
import { verifyMenuType } from '~/middleware/menu-middleware'
import { requiredField, requiredFieldType } from '~/middleware/verify-middleware'

import { menuFields, menuFieldType } from '../config/menu-config'

const menuRouter = new Router({ prefix: '/menu' })

menuRouter.get(
  '/list-tree',
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/menu-manage', 'table', 'query'),
  getMenuTree
)
menuRouter.get('/list-tree-select', verifyTokenExist, verifyTokenInvalid, getMenuTreeSelect)

menuRouter.get('/', verifyTokenExist, verifyTokenInvalid, getMenu)
menuRouter.post(
  '/create',
  requiredField(menuFields),
  requiredFieldType(menuFieldType.createMenu),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/menu-manage', 'table', 'insert'),
  verifyMenuType,
  createMenu
)
menuRouter.patch(
  '/:menuId',
  requiredField(menuFields),
  requiredFieldType(menuFieldType.createMenu),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/menu-manage', 'table', 'update'),
  verifyMenuType,
  updateMenu
)
menuRouter.delete(
  '/delete-menu',
  requiredField(['menuIds']),
  requiredFieldType(menuFieldType.deleteMenu),
  verifyTokenExist,
  verifyTokenInvalid,
  verifyPermission('system/menu-manage', 'table', 'delete'),
  deleteMenu
)

module.exports = menuRouter
