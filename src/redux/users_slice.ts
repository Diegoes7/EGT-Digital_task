// src/store/usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { User, UsersState } from './types'


const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  editedUsers: {},
  selectedUser: null,
}

// Async thunk query to get users from API
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
  return res.data
})

// Async thunks queries to get data from API
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: number) => {
    const response = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`)
    return response.data
  }
)

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
  },

  //Handle the async operations 
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error happened. No user fetched'
      })

      // Single user fetching
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch user by ID'
      })
  }
})

export const { editUser, revertUser, submitUser, clearSelectedUser } = usersSlice.actions
export default usersSlice.reducer
