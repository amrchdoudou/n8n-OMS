export interface User {
  id: string
  username: string
  storeName: string
  number: string
  email?: string
  createdAt: string
  apiKey?: string
}

export interface AuthCredentials {
  username: string
  password: string
}
