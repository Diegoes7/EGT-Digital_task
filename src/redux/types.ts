// Gather all the types used in redux in one place
export type Address = {
  street: string
  suite: string
  city: string
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  address: Address
}

export type UsersState = {
  users: User[]
  loading: boolean
  error: string | null
  editedUsers: Record<number, User> // Track local edits
  selectedUser: User | null
}

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type PostsState = {
  posts: Post[]
  loading: boolean
  error: string | null
  editedUser: User | null
  editedPosts: Record<number, Post>
}


export type Task = {
  userId: number
  id: number
  title: string
  completed: boolean
}

export type Filters = {
  status: 'all' | 'completed' | 'not_completed'
  title: string
  userId: number | null
}

export type TasksState = {
  tasks: Task[]
  filteredTasks: Task[]
  loading: boolean
  error: string | null
  filters: Filters
  currentPage: number
  pageSize: number
}