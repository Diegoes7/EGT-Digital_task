import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Post, PostsState } from './types'
import { AppThunk } from './store'
import { clearRequest, getRequest, setRequest } from '../utils/requests_cache'


const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  editedUser: null,
  editedPosts: {},
}

// Queries to API, asynchronous
// export const fetchUserPosts = createAsyncThunk(
//   'posts/fetchUserPosts',
//   async (userId: number) => {
//     const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
//     return response.data
//   }
// )

export const fetchUserPosts = (userId: number): AppThunk => async (dispatch, getState) => {
  const cacheKey = `user-posts-${userId}`

  // Check if request is already in-flight
  const inFlight = getRequest(cacheKey)
  if (inFlight !== undefined) return // Skip if request is already in-flight

  // Check if the posts are already in Redux state
  const state = getState()
  if (state.posts.editedUser?.id === userId && state.posts.posts.length > 0) return // ✅ Skip if already in Redux

  dispatch(postsRequestStarted())

  const request = axios
    .get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then((res) => {
      dispatch(postsRequestSuccess(res.data))
      clearRequest(cacheKey)
    })
    .catch((err) => {
      dispatch(postsRequestFailed(err.message))
      clearRequest(cacheKey)
    })

  setRequest(cacheKey, request)
}

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (post: Post) => {
    const response = await axios.put<Post>(
      `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      post
    )
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: number) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    return postId
  }
)

// State Slice
const userDetailsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    editPost(state, action: PayloadAction<{ id: number; changes: Partial<Post> }>) {
      const { id, changes } = action.payload
      const original = state.posts.find((post) => post.id === id)
      if (!original) return
      state.editedPosts[id] = { ...original, ...state.editedPosts[id], ...changes }
    },
    revertPost(state, action: PayloadAction<number>) {
      delete state.editedPosts[action.payload]
    },
    // Action for starting the request
    postsRequestStarted(state) {
      state.loading = true
      state.error = null // Clear any previous errors when a new request starts
    },

    // Action for successful request
    postsRequestSuccess(state, action: PayloadAction<Post[]>) {
      state.loading = false
      state.posts = action.payload // Update posts with the fetched data
    },

    // Action for failed request
    postsRequestFailed(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload // Set the error message
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchUserPosts.pending, (state) => {
      //   state.loading = true
      // })
      // .addCase(fetchUserPosts.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.posts = action.payload
      //   state.editedPosts = {}
      // })
      // .addCase(fetchUserPosts.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.error.message || 'Failed to load posts'
      // })

      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) {
          state.posts[idx] = action.payload
          delete state.editedPosts[action.payload.id]
        }
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload)
        delete state.editedPosts[action.payload]
      })
  },
})

export const {
  editPost,
  revertPost,
  postsRequestStarted,
  postsRequestSuccess,
  postsRequestFailed
} = userDetailsSlice.actions

export default userDetailsSlice.reducer
