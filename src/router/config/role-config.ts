export const roleFieldType: { [k: string]: App.IFieldListType[] } = {
  roleList: [
    { field: 'pageNo', types: ['String', 'Number'], isOptional: true },
    { field: 'pageSize', types: ['String', 'Number'], isOptional: true },
    { field: 'orderBy', types: ['String'], isOptional: true },
    { field: 'order', types: ['String'], isOptional: true },
    { field: 'queryCondition', types: ['Object'], isOptional: true }
  ],
  updateRole: [
    { field: 'role_name', types: ['String'] },
    { field: 'role_alias', types: ['String'] },
    { field: 'status', types: ['Number', 'String'] },
    { field: 'permissionList', types: ['Array'] }
  ],
  updateRoleStatus: [{ field: 'status', types: ['Number', 'String'] }],
  deleteRole: [{ field: 'roleIds', types: ['Array'] }]
}
