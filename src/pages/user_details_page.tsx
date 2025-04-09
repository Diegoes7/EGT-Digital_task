import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	AppDispatch,
	RootState,
	fetchUserById,
	fetchUserPosts,
	updatePost,
	deletePost,
	editPost,
	revertPost,
	Post,
} from '../redux'
import { message } from 'antd'
import { PostsList } from '../components/posts_list'
import { UserDetails } from '../components/user_details'
import { Header } from '../components/header'

export default function UserDetailsPage() {
	const { userId } = useParams()
	const dispatch = useDispatch<AppDispatch>()

	const { selectedUser, loading, error, editedUsers } = useSelector(
		(state: RootState) => state.users
	)
	const { posts, editedPosts } = useSelector((state: RootState) => state.posts)

	React.useEffect(() => {
		if (!userId) return
		const id = parseInt(userId, 10)
		dispatch(fetchUserById(id))
		dispatch(fetchUserPosts(id))
	}, [userId, dispatch])

	React.useEffect(() => {
		if (error) {
			message.error(error)
		}
	}, [error])

	const handlePostChange = (id: number, field: string, value: any) => {
		dispatch(editPost({ id, changes: { [field]: value } }))
	}

	const handlePostSubmit = React.useCallback(
		async (id: number) => {
			try {
				const post = editedPosts[id] || posts.find((p: Post) => p.id === id)
				if (!post) {
					message.error('Post not found')
					return
				}

				await dispatch(updatePost(post)).unwrap()
				message.success({
					content: 'Post updated!',
					duration: 3,
					className: 'custom-message',
				})
			} catch (error) {
				message.error({
					content: 'Failed to update post',
					duration: 3,
					className: 'custom-message',
				})
			}
		},
		[dispatch, editedPosts, posts]
	)

	const handleDelete = React.useCallback(
		async (id: number) => {
			try {
				await dispatch(deletePost(id)).unwrap()
				message.success({
					content: 'Post deleted successfully',
					duration: 3,
					className: 'custom-message',
				})
			} catch (error) {
				message.error({
					content: 'Failed to delete post',
					duration: 3,
					className: 'custom-message',
				})
			}
		},
		[dispatch]
	)

	return (
		<div>
			<Header title='User Details' />
			<UserDetails
				userEdited={editedUsers[selectedUser?.id ?? 0] || selectedUser}
				loading={loading}
			/>
			<PostsList
				posts={posts}
				loading={loading}
				editedPosts={editedPosts}
				onPostChange={handlePostChange}
				onPostSubmit={handlePostSubmit}
				onPostDelete={handleDelete}
				onRevertPost={(id) => dispatch(revertPost(id))}
			/>
		</div>
	)
}
