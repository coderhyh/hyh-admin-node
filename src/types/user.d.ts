export interface ICreateUser {
  username: string
  password: string
  nickname: string
  role: string
}

export interface IUserInfo {
  id: number
  user_name: string
  user_pwd: string
  nickname: string
  role: number
  create_time: string
  update_time: string
  last_login_time: null | string
}
