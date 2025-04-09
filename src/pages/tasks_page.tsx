import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks, fetchUsers, Filters, setFilters, toggleTaskStatus } from '../redux'
import { TasksTable } from '../components/tasks_table'
import { RootState, AppDispatch } from '../redux/store' // Add AppDispatch import

export default function TasksPage() {
	const dispatch = useDispatch<AppDispatch>()
	const { tasks, filteredTasks, filters, loading } = useSelector(
		(state: RootState) => state.tasks
	)
	const users = useSelector((state: RootState) => state.users.users)

	React.useEffect(() => {
		if (tasks.length === 0) {
			dispatch(fetchTasks())
		}
	}, [dispatch, tasks])

    React.useEffect(() => {
      if (users.length === 0 && !loading) {
        dispatch(fetchUsers());
      }
    }, [dispatch, loading, users])

	// useEffect(() => {
	// 	dispatch(setFilters(filters))
	// }, [dispatch, filters])

	const handleStatusChange = React.useCallback(
		(taskId: number) => {
			dispatch(toggleTaskStatus(taskId))
		},
		[dispatch]
	)

	const handleFilterChange = React.useCallback(
		(newFilters: Partial<Filters>) => {
			dispatch(setFilters({ ...filters, ...newFilters }))
		},
		[dispatch, filters]
	)
	return (
		<TasksTable
			users={users}
			filteredTasks={filteredTasks}
			filters={filters}
			loading={loading}
			onStatusChange={handleStatusChange}
			onFilterChange={handleFilterChange}
		/>
	)
}
