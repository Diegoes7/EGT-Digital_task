// src/store/usersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UsersState } from './types'
import axios from 'axios'
import { AppThunk } from './store' // adjust path as needed
import { getRequest, setRequest, clearRequest } from '../utils/requests_cache' // same cache used for deduping


const initialState: UsersState = {
  users: [],
  byId: {},
  loading: false,
  error: null,
  editedUsers: {},
  selectedUser: null,
}

// Async thunk query to get users from API
// export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
//   const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
//   return res.data
// })

export const fetchUsers = (): AppThunk => async (dispatch, getState) => {
  const cacheKey = 'users-list'
  const inFlight = getRequest(cacheKey)
  if (inFlight !== undefined) return // Skip if request is already in-flight

  const state = getState()
  if (state.users.users.length > 0) return // ✅ Skip if already in Redux

  dispatch(userListRequestStarted())

  const request = axios
    .get<User[]>('https://jsonplaceholder.typicode.com/users')
    .then((res) => {
      dispatch(userListRequestSuccess(res.data))
      clearRequest(cacheKey)
    })
    .catch((err) => {
      dispatch(userListRequestFailed(err.message))
      clearRequest(cacheKey)
    })

  setRequest(cacheKey, request)
}


// Async thunks queries to get data from API
// export const fetchUserById = createAsyncThunk(
//   'users/fetchUserById',
//   async (userId: number) => {
//     const response = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`)
//     return response.data
//   }
// )

export const fetchUserById = (userId: number): AppThunk => async (dispatch, getState) => {
  const key = `user-${userId}`
  const existing = getRequest(key)
  if (existing !== undefined) return // Skip if in-flight

  const state = getState()
  const alreadyLoaded = state.users.byId[userId]
  // const alreadyLoaded = state.users.users.find(u => u.id === userId);
  if (alreadyLoaded) return //  already have it loaded

  dispatch(userRequestStarted())

  const request = axios
    .get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((res) => {
      dispatch(userRequestSuccess(res.data))
      clearRequest(key)
    })
    .catch((err) => {
      dispatch(userRequestFailed(err.message))
      clearRequest(key)
    })

  setRequest(key, request)
}


// State Slice 
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    editUser(state, action: PayloadAction<{ id: number; changes: Partial<User> }>) {
      const { id, changes } = action.payload
      const existing = state.editedUsers[id] || state.users.find(u => u.id === id)
      if (existing) {
        state.editedUsers[id] = { ...existing, ...changes }
      }
    },
    revertUser(state, action: PayloadAction<number>) {
      delete state.editedUsers[action.payload]
    },
    submitUser(state, action: PayloadAction<number>) {
      const id = action.payload
      const edited = state.editedUsers[id]
      if (edited) {
        const index = state.users.findIndex(u => u.id === id)
        if (index !== -1) {
          state.users[index] = edited
        }
        delete state.editedUsers[id]
      }
    },
    clearSelectedUser(state) {
      state.selectedUser = null
    },
    userListRequestStarted(state) {
      state.loading = true
      state.error = null
    },
    userListRequestSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false
      state.users = action.payload
    },
    userListRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    userRequestStarted(state) {
      state.loading = true
      state.error = null
    },
    userRequestSuccess(state, action: PayloadAction<User>) {
      state.loading = false
      const user = action.payload
      state.byId[user.id] = user
      state.selectedUser = action.payload
    },
    userRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },

  //Handle the async operations 
  // extraReducers: (builder) => {
  //   builder
  //     // Fetch all users
  //     .addCase(fetchUsers.pending, (state) => {
  //       state.loading = true
  //       state.error = null
  //     })
  //     .addCase(fetchUsers.fulfilled, (state, action) => {
  //       state.loading = false
  //       state.users = action.payload
  //     })
  //     .addCase(fetchUsers.rejected, (state, action) => {
  //       state.loading = false
  //       state.error = action.error.message || 'Error happened. No user fetched'
  //     })

  //     // Single user fetching
  //     .addCase(fetchUserById.pending, (state) => {
  //       state.loading = true
  //       state.error = null
  //     })
  //     .addCase(fetchUserById.fulfilled, (state, action) => {
  //       state.loading = false
  //       state.selectedUser = action.payload
  //     })
  //     .addCase(fetchUserById.rejected, (state, action) => {
  //       state.loading = false
  //       state.error = action.error.message || 'Failed to fetch user by ID'
  //     })
  // }
})

export const { editUser, revertUser, submitUser, clearSelectedUser, userListRequestStarted,
  userListRequestSuccess,
  userListRequestFailed, userRequestFailed, userRequestStarted, userRequestSuccess } = usersSlice.actions
export default usersSlice.reducer
