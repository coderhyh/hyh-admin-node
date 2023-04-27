export const userFieldType: { [k: string]: App.IFieldListType[] } = {
  createUser: [
    { field: 'username', types: ['String'] },
    { field: 'password', types: ['String'] },
    { field: 'role', types: ['String', 'Number'] },
    { field: 'nickname', types: ['String'] }
  ],
  userLogin: [
    { field: 'username', types: ['String'] },
    { field: 'username', types: ['String'] }
  ],
  userList: [
    { field: 'pageNo', types: ['String', 'Number'], isOptional: true },
    { field: 'pageSize', types: ['String', 'Number'], isOptional: true },
    { field: 'orderBy', types: ['String'], isOptional: true },
    { field: 'order', types: ['String'], isOptional: true },
    { field: 'queryCondition', types: ['Object'], isOptional: true }
  ],
  deleteUsers: [{ field: 'userIds', types: ['Array'] }],
  updateUser: [
    { field: 'username', types: ['String'] },
    { field: 'role', types: ['String', 'Number'] },
    { field: 'nickname', types: ['String'] }
  ]
}
