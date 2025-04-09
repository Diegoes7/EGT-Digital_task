import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import reportWebVitals from './reportWebVitals'
import 'antd/dist/reset.css'
import '@ant-design/v5-patch-for-react-19'
import { unstableSetRender } from 'antd'

// Extend HTMLElement type to allow _reactRoot
declare global {
	interface HTMLElement {
		_reactRoot?: ReactDOM.Root
	}
}

// Setting up custom rendering logic for Ant Design
unstableSetRender((node, container) => {
	// TypeScript requires casting the container to HTMLElement
	const htmlContainer = container as HTMLElement

	// Ensure the container has a react root
	htmlContainer._reactRoot ||= ReactDOM.createRoot(htmlContainer)
	const root = htmlContainer._reactRoot

	// Render the node to the root
	root.render(node)

	// Return an async function to unmount the component
	return async () => {
		await new Promise((resolve) => setTimeout(resolve, 0))
		root.unmount()
	}
})

// React root element rendering with BrowserRouter
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
