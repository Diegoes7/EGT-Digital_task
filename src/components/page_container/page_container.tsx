// components/layout/PageContainer.tsx
import React from 'react'
import './page_container.css'

type PageContainerProps = {
	children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
	return (
		<div className='page-container'>
			<div className='content-wrapper'>{children}</div>
		</div>
	)
}

export default PageContainer
