import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    name: string,
    email: string,
    access_token: string,
    user: {
      id: string,
      name: string,
      email: string,
      role: string
    },
    error?: string,
  }
}