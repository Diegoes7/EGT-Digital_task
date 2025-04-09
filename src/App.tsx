import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Route, Routes } from 'react-router-dom'
import TasksPage from './pages/tasks_page'
import UsersPage from './pages/users_page'
import UserDetailsPage from './pages/user_details_page'
import PageContainer from './components/page_container/page_container'

function App() {
	return (
		<Provider store={store}>
			<PageContainer>
				<Routes>
					<Route path='/tasks' element={<TasksPage />} />
					<Route path='/' element={<UsersPage />} />
					<Route path='/:userId/posts' element={<UserDetailsPage />} />
				</Routes>
			</PageContainer>
		</Provider>
	)
}

export default App
