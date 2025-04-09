import { User } from '../redux'
import { Collapse, Flex } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { NavBtn } from './buttons'
import { UserDetails } from './user_details'

interface UsersListProps {
	users: User[]
	loading: boolean
	editedUsers: Record<number, User>
}

export function UsersList({ users, loading, editedUsers }: UsersListProps) {
	return (
		<div>
			<Flex
				className='horizontal'
				style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}
			>
				<h2 className='section-heading'>User List</h2>
				<NavBtn to='/tasks' label='Go to tasks' />
			</Flex>
			{loading && (
				<p>
					{' '}
					<LoadingOutlined style={{ fontSize: '1.5em' }} />
				</p>
			)}
			<Collapse accordion>
				{users.map((user) => {
					const userEdited = editedUsers[user.id] || user

					return (
						<Collapse.Panel header={user.name} key={user.id}>
							<UserDetails loading={loading} userEdited={userEdited} />
						</Collapse.Panel>
					)
				})}
			</Collapse>
		</div>
	)
}
