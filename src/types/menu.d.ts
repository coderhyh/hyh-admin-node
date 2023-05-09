declare namespace Menu {
  type MenuType = 'menu' | 'directory' | 'permission'
  interface IMenuItem {
    id: number
    page: string
    icon: string
    status: number
    route: string
    routeName: string
    permission: string
    component: string
    type: MenuType
    parentId: number
    requiredId: number | null
    requiredText: string
    order: number
  }
}
