import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import usersReducer from './users_slice'
import userDetailsReducer from './posts_slice'
import tasksReducer from './tasks_slice'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: userDetailsReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Add this AppThunk type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;