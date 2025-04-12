import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Filters, Task, TasksState } from './types'
import { AppThunk } from './store'
import { clearRequest, getRequest, setRequest } from '../utils/requests_cache'


const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    title: '',
    userId: null,
  },
  currentPage: 1,
  pageSize: 10,
}

// Query to get tasks[] from API
// export const fetchTasks = createAsyncThunk<Task[]>('tasks/fetchTasks', async () => {
//   const response = await axios.get<Task[]>('https://jsonplaceholder.typicode.com/todos')
//   return response.data
// })

export const fetchTasks = (): AppThunk => async (dispatch, getState) => {
  const cacheKey = 'tasks-list'

  // Prevent multiple simultaneous requests
  const inFlight = getRequest(cacheKey)
  if (inFlight !== undefined) return

  const state = getState()
  if (state.tasks.tasks.length > 0) return // Skip if tasks are already in state

  dispatch(tasksRequestStarted()) // Dispatch request started

  const request = axios
    .get<Task[]>('https://jsonplaceholder.typicode.com/todos')
    .then((res) => {
      dispatch(tasksRequestSuccess(res.data)) // Dispatch success with data
      dispatch(applyFilters()) // Apply filters after tasks are fetched
      clearRequest(cacheKey)
    })
    .catch((err) => {
      dispatch(tasksRequestFailed(err.message)) // Dispatch error
      clearRequest(cacheKey)
    })

  setRequest(cacheKey, request) // Store request in cache to prevent duplicates
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Action for starting the request
    tasksRequestStarted(state) {
      state.loading = true
      state.error = null // Clear previous errors when a new request starts
    },

    // Action for successful request
    tasksRequestSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false
      state.tasks = action.payload // Update tasks with the fetched data
    },

    // Action for failed request
    tasksRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload // Set the error message
    },
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload }
      tasksSlice.caseReducers.applyFilters(state)
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
    toggleTaskStatus(state, action: PayloadAction<number>) {
      const task = state.tasks.find(t => t.id === action.payload)
      if (task) {
        task.completed = !task.completed
        tasksSlice.caseReducers.applyFilters(state) // re-apply filter after status change
      }
    },
    applyFilters(state) {
      const { tasks, filters } = state
      let filtered = [...tasks]

      if (filters.status !== 'all') {
        filtered = filtered.filter(task =>
          filters.status === 'completed' ? task.completed : !task.completed
        )
      }

      if (filters.title.trim()) {
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(filters.title.toLowerCase())
        )
      }

      if (filters.userId !== null) {
        filtered = filtered.filter(task => task.userId === filters.userId)
      }

      state.filteredTasks = filtered
      state.currentPage = 1
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchTasks.pending, (state) => {
  //       state.loading = true
  //       state.error = null
  //     })
  //     .addCase(fetchTasks.fulfilled, (state, action) => {
  //       state.loading = false
  //       state.tasks = action.payload
  //       tasksSlice.caseReducers.applyFilters(state)
  //     })
  //     .addCase(fetchTasks.rejected, (state, action) => {
  //       state.loading = false
  //       state.error = action.error.message ?? 'Failed to fetch tasks'
  //     })
  // },
})

export const {
  setFilters,
  setPage,
  toggleTaskStatus,
  applyFilters,
  tasksRequestStarted,
  tasksRequestSuccess,
  tasksRequestFailed,
} = tasksSlice.actions

export default tasksSlice.reducer
