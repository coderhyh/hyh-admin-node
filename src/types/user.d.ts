import { ROLE } from '~/enums'

export interface ICreateUser {
  username: string
  password: string
  nickname: string
  role: string
}

export interface IUserInfo {
  id: number
  username: string
  nickname: string
  jwt: string
  create_time: string
  update_time: string
  last_login_time?: any
  role: Role
  permission: string[]
}

export interface Role {
  id: ROLE
  role_name: string
  role_alias: string
}
