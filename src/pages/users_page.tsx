// src/pages/Home.tsx
import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchUsers } from '../redux/users_slice'
import { UsersList } from '../components/users_list'

export default function UsersPage() {
	const dispatch = useAppDispatch()
	const { users, loading, editedUsers } = useAppSelector((state) => state.users)

	React.useEffect(() => {
		if (users.length === 0 && !loading) {
			dispatch(fetchUsers())
		}
	}, [dispatch, loading, users])

	return <UsersList users={users} loading={loading} editedUsers={editedUsers} />
}
