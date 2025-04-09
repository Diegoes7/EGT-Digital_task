import { configureStore } from '@reduxjs/toolkit'
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