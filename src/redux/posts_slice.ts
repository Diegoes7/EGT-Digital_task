import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Post, PostsState } from './types'


const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  editedUser: null,
  editedPosts: {},
}


export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId: number) => {
    const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    return response.data
  }
)

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

// Slice from State
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
        state.editedPosts = {}
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load posts'
      })

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
} = userDetailsSlice.actions

export default userDetailsSlice.reducer
