export interface User {
  id: string
  username: string
  storeName: string
  telegram: string
  email?: string
  createdAt: string
}

export interface AuthCredentials {
  username: string
  password: string
}
