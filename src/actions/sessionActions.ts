import { createAction } from '@reduxjs/toolkit'

export const setUser: any = createAction<object>('session/setUser')

export const signOut: any = createAction('session/signOut')
