import { configureStore as configureReduxStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from '../reducers'

// @link: https://redux.js.org/recipes/configuring-your-store#simplifying-setup-with-redux-toolkit
export const configureStore = (preloadedState = {}) => {
  const store = configureReduxStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
