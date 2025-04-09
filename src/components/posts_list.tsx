import React from 'react'
import { Form, Input, Button, List, Popconfirm } from 'antd'
import { Header } from './header'
import { Post } from '../redux'
import { LoadingOutlined } from '@ant-design/icons'

type PostListProps = {
	posts: Post[]
	editedPosts: Record<number, Post>
	loading: boolean
	onPostChange: (id: number, field: string, value: any) => void
	onPostSubmit: (id: number) => void
	onPostDelete: (id: number) => void
	onRevertPost: (id: number) => void
}

// Posts component, show lists of all post to a specific user 
export function PostsList({
	loading,
	posts,
	editedPosts,
	onPostChange,
	onPostSubmit,
	onPostDelete,
	onRevertPost,
}: PostListProps) {
	const createPostChangeHandler = React.useCallback(
		(postId: number, field: 'title' | 'body') =>
			(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				onPostChange(postId, field, e.target.value)
			},
		[onPostChange]
	)

	const createPostSubmitHandler = React.useCallback(
		(postId: number) => () => {
			onPostSubmit(postId)
		},
		[onPostSubmit]
	)

	const createPostDeleteHandler = React.useCallback(
		(postId: number) => () => {
			onPostDelete(postId)
		},
		[onPostDelete]
	)

	const createPostRevertHandler = React.useCallback(
		(postId: number) => () => {
			onRevertPost(postId)
		},
		[onRevertPost]
	)

	return (
		<div style={{ marginTop: '0.5em' }}>
			<Header title='Posts' />
			{loading && (
				<p>
					{' '}
					<LoadingOutlined style={{ fontSize: '1.5em' }} />
				</p>
			)}
			<List
				itemLayout='vertical'
				dataSource={posts}
				renderItem={(post) => {
					const changes = editedPosts[post.id] || {}
					const current = { ...post, ...changes }

					return (
						<List.Item className='box-shadow' style={{ marginBottom: '0.5em' }}>
							<div style={{ padding: '0.7em' }}>
								<Form layout='horizontal' className='w-full'>
									<Form.Item
										style={{ fontWeight: 'bold', margin: '0.5em' }}
										label='ID'
									>
										{post.id}
									</Form.Item>
									<Form.Item
										label='Title'
										labelCol={{ span: 24 }}
										wrapperCol={{ span: 24 }}
									>
										<Input
											value={current.title}
											onChange={createPostChangeHandler(post.id, 'title')}
										/>
									</Form.Item>
									<Form.Item
										label='Body'
										labelCol={{ span: 24 }}
										wrapperCol={{ span: 24 }}
									>
										<Input.TextArea
											rows={5}
											value={current.body}
											onChange={createPostChangeHandler(post.id, 'body')}
											style={{ width: '100%' }}
										/>
									</Form.Item>
									<div style={{ display: 'flex', gap: '0.5em' }}>
										<Button
											type='primary'
											onClick={createPostSubmitHandler(post.id)}
											loading={loading}
											disabled={Object.keys(changes).length === 0}
										>
											Save
										</Button>
										<Popconfirm
											title='Are you sure you want to delete this post?'
											onConfirm={createPostDeleteHandler(post.id)}
											okText='Yes'
											cancelText='No'
											overlayStyle={{
												fontSize: '1em',
												padding: '0.5em',
												width: '20em',
											}}
										>
											<Button danger>Delete</Button>
										</Popconfirm>
										{editedPosts[post.id] && (
											<Button onClick={createPostRevertHandler(post.id)}>
												Revert
											</Button>
										)}
									</div>
								</Form>
							</div>
						</List.Item>
					)
				}}
			/>
		</div>
	)
}
