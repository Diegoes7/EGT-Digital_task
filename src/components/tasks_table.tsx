import React from 'react'
import { Table, Select, Input, Checkbox } from 'antd'
import { Filters } from '../redux'
import { Header } from './header'
import { LoadingOutlined } from '@ant-design/icons'

const { Option } = Select

type FilterField = 'userId' | 'title' | 'status'
type Status = 'all' | 'completed' | 'not_completed'

type User = {
	id: number
	name: string
}

type Task = {
	id: number
	title: string
	completed: boolean
	userId: number
}

type TasksTableProps = {
	users: User[]
	filteredTasks: Task[]
	filters: Filters
	loading: boolean
	onStatusChange: (taskId: number) => void
	onFilterChange: (newFilters: Partial<Filters>) => void
}

export function TasksTable({
	users,
	filteredTasks,
	filters,
	loading,
	onStatusChange,
	onFilterChange,
}: TasksTableProps) {
	const handleFilterChange = React.useCallback(
		(
			field: FilterField,
			value: string | React.ChangeEvent<HTMLInputElement>
		) => {
			switch (field) {
				case 'userId':
					onFilterChange({
						userId: value === 'all' ? null : parseInt(value as string, 10),
					})
					break
				case 'title':
					onFilterChange({
						title: (value as React.ChangeEvent<HTMLInputElement>).target.value,
					})
					break
				case 'status':
					onFilterChange({
						status: value as Status,
					})
					break
				default:
					break
			}
		},
		[onFilterChange]
	)

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Owner',
			dataIndex: 'userId',
			key: 'userId',
			render: (userId: number) =>
				users.find((u) => u.id === userId)?.name || 'Unknown',
		},
		{
			title: 'Completed',
			dataIndex: 'completed',
			key: 'completed',
			render: (completed: boolean, record: Task) => (
				<Checkbox
					checked={completed}
					onChange={() => onStatusChange(record.id)}
				/>
			),
		},
	]

	return (
		<div className='p-4 max-w-6xl mx-auto'>
			<Header title='Tasks' />
			{loading && (
				<p>
					{' '}
					<LoadingOutlined style={{ fontSize: '1.5em' }} />
				</p>
			)}
			<div className='flex flex-wrap gap-4 mb-4'>
				<Select
					placeholder='Filter by status'
					value={filters.status}
					onChange={(value) => handleFilterChange('status', value)}
					style={{ width: 200 }}
				>
					<Option value='all'>All</Option>
					<Option value='completed'>Completed</Option>
					<Option value='not_completed'>Not Completed</Option>
				</Select>

				<Input
					placeholder='Filter by title'
					value={filters.title}
					onChange={(e) => handleFilterChange('title', e)}
					style={{ width: 300 }}
				/>

				<Select
					placeholder='Filter by owner'
					value={filters.userId !== null ? String(filters.userId) : 'all'}
					onChange={(value) => handleFilterChange('userId', value)}
					style={{ width: 200 }}
				>
					<Option value='all'>All Users</Option>
					{(users || [])?.map((user) => (
						<Option key={user.id} value={String(user.id)}>
							{user.name}
						</Option>
					))}
				</Select>
			</div>

			<Table
				columns={columns}
				dataSource={filteredTasks}
				pagination={{ pageSize: 10 }}
				rowKey='id'
				loading={loading}
			/>
		</div>
	)
}

// back button
