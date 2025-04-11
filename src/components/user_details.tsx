import React from 'react'
import isEqual from 'lodash.isequal'
import {
	editUser,
	submitUser,
	revertUser,
	useAppDispatch,
	User,
} from '../redux'
import { Button, Input, Form, message } from 'antd'
import { NavBtn } from './buttons'
import { LoadingOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { validateField } from '../utils/validation'

type UserDetailsProps = {
	userEdited: User
	loading?: boolean
}

type TopLevelUserField = keyof Omit<User, 'address'>
type AddressField = keyof User['address']

export function UserDetails({ userEdited, loading }: UserDetailsProps) {
	const path = useLocation().pathname
	const dispatch = useAppDispatch()
	const [hasChanges, setHasChanges] = React.useState<boolean>(false)
	const [localUser, setLocalUser] = React.useState<User | null>(userEdited)
	const [fieldErrors, setFieldErrors] = React.useState<{
		[key: string]: string[]
	}>({})
	const [initialUser, setInitialUser] = React.useState(userEdited)

	// Function to check if there are any errors in the fieldErrors state
	const hasErrors = Object.values(fieldErrors).some(
		(errors) => errors.length > 0
	)

	React.useEffect(() => {
		if (isEqual(localUser, initialUser)) {
			setHasChanges(false)
		} else {
			setHasChanges(true)
		}
		if (
			path === `/${userEdited?.id}/posts` &&
			isEqual(localUser, initialUser)
		) {
			setInitialUser(userEdited)
		}
	}, [initialUser, localUser, path, userEdited])

	React.useEffect(() => {
		// console.log(userEdited)
		if (userEdited) {
			setLocalUser(userEdited)
		}
	}, [userEdited])

	// Create a generic handler function
	const handleFieldChange = React.useCallback(
		(field: string, value: string) => {
			if (!localUser) return

			// Validate the specific field when it changes
			const errors = validateField(field, value)

			// Update the errors for this specific field
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				[field]: errors,
			}))

			const updatedUser: User = {
				...localUser,
				address: {
					...localUser.address,
				},
			}

			if (['street', 'suite', 'city', 'zipcode', 'geo'].includes(field)) {
				;(updatedUser.address as any)[field as AddressField] = value
			} else {
				;(updatedUser as any)[field as TopLevelUserField] = value
			}

			setLocalUser(updatedUser)

			const changes: Partial<User> = {
				address: updatedUser.address,
				...(field in updatedUser ? { [field]: value } : {}),
			}

			dispatch(editUser({ id: localUser.id, changes }))

			if (!hasChanges) setHasChanges(true)
		},
		[dispatch, hasChanges, localUser]
	)

	const handleRevertUser = React.useCallback(
		(user: User) => {
			dispatch(revertUser(user.id))
			setLocalUser(user) // Reset local state
			setFieldErrors({}) // Clear validation errors
			if (hasChanges === true) {
				setHasChanges(false)
			}
		},
		[dispatch, hasChanges]
	)

	const handleSubmitUser = React.useCallback(
		async (userId: number) => {
			try {
				// Dispatch the submit action
				await dispatch(submitUser(userId))
				setHasChanges(false)

				// If the submission is successful, show a success message
				message.success({
					content: 'User saved successfully!',
					duration: 3, // duration
					className: 'custom-message', // Apply the custom message class
				})
			} catch (error) {
				// If an error occurs, show an error message
				message.error({
					content: 'Failed to save user. Please try again.',
					duration: 3, // duration
					className: 'custom-message', // Apply the custom message class
				})
			}
		},
		[dispatch]
	)
	return (
		<Form layout='vertical'>
			{loading && (
				<p>
					{' '}
					<LoadingOutlined style={{ fontSize: '1.5em' }} />
				</p>
			)}
			<Form.Item label='Username' required>
				<Input
					value={localUser?.username ?? ''}
					onChange={(e) => handleFieldChange('username', e.target.value)}
				/>
				{fieldErrors['username'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['username'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<Form.Item label='Name' required>
				<Input
					value={localUser?.name ?? ''}
					onChange={(e) => handleFieldChange('name', e.target.value)}
				/>
				{fieldErrors['name'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['name'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<Form.Item label='Email' required>
				<Input
					value={localUser?.email ?? ''}
					onChange={(e) => handleFieldChange('email', e.target.value)}
				/>
				{fieldErrors['email'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['email'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<Form.Item label='Telephone' required>
				<Input
					value={localUser?.phone ?? ''}
					onChange={(e) => handleFieldChange('phone', e.target.value)}
				/>
				{fieldErrors['phone'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['phone'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<Form.Item label='Street' required>
				<Input
					value={localUser?.address?.street ?? ''}
					onChange={(e) => handleFieldChange('street', e.target.value)}
				/>
				{fieldErrors['street'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['street'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<Form.Item label='Suite' required>
				<Input
					value={localUser?.address?.suite ?? ''}
					onChange={(e) => handleFieldChange('suite', e.target.value)}
				/>
				{fieldErrors['suite'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['suite'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<Form.Item label='City' required>
				<Input
					value={localUser?.address?.city ?? ''}
					onChange={(e) => handleFieldChange('city', e.target.value)}
				/>
				{fieldErrors['city'] && (
					<div style={{ color: 'red' }}>
						{fieldErrors['city'].map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
			</Form.Item>
			<div style={{ display: 'flex', gap: 10 }}>
				<Button
					type='primary'
					disabled={!hasChanges || hasErrors}
					onClick={() => handleSubmitUser(userEdited?.id)}
				>
					Submit
				</Button>
				<Button
					disabled={!hasChanges}
					onClick={() => handleRevertUser(userEdited)}
				>
					Cancel
				</Button>
				{path === '/' && (
					<NavBtn
						to={`/${userEdited?.id}/posts`}
						key='see_posts'
						label='See posts'
					/>
				)}
			</div>
		</Form>
	)
}
