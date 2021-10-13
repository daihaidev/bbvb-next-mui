import { createReducer } from '@reduxjs/toolkit'
import { actions } from '../actions'

const initialState = {
  loggedIn: false,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    avatar: '/images/avatars/avatar_11.png',
    bio: '',
    role: '',
  },
}

const sessionReducer = createReducer(initialState, {
  [actions.signOut]: () => {
    return {
      ...initialState,
    }
  },
  [actions.setUser]: (state, action) => ({
    ...state,
    loggedIn: true,
    user: action.payload,
  }),
})

export default sessionReducer
