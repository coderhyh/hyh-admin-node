export const menuFieldType: { [k: string]: App.IFieldListType[] } = {
  createMenu: [
    { field: 'page', types: ['String'] },
    { field: 'icon', types: ['String', 'Null'] },
    { field: 'status', types: ['Number', 'String'] },
    { field: 'route', types: ['String', 'Null'] },
    { field: 'routeName', types: ['String', 'Null'] },
    { field: 'permission', types: ['String', 'Null'] },
    { field: 'component', types: ['String', 'Null'] },
    { field: 'type', types: ['String'] },
    { field: 'parentId', types: ['String', 'Number', 'Null'] },
    { field: 'requiredId', types: ['String', 'Number', 'Null'] },
    { field: 'order', types: ['String', 'Number'] }
  ],
  deleteMenu: [{ field: 'menuIds', types: ['Array'] }]
}

export const menuFields = [
  'page',
  'icon',
  'status',
  'route',
  'routeName',
  'permission',
  'component',
  'type',
  'parentId',
  'requiredId',
  'order'
]
