import { combineReducers } from '@reduxjs/toolkit'
import sessionReducer from './sessionReducer'

export const rootReducer = combineReducers({
  session: sessionReducer,
})
