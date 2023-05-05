declare namespace User {
  interface IUserAccount {
    id: number
    username: string
    password: string
  }
  interface ICreateUser {
    username: string
    password: string
    nickname: string
    role: string
  }

  interface IUserInfo {
    id: number
    username: string
    nickname: string
    jwt: string
    create_time: string
    update_time: string
    last_login_time?: any
    role: Role
    status: App.AccountStatus
    permission: string[]
  }

  interface Role {
    id: number
    role_name: string
    role_alias: string
    status: App.AccountStatus
    grade: number
  }
}
