import { Flex } from 'antd'
import { BackBtn } from './buttons'

type HeaderProps = {
	style?: React.CSSProperties
	title: string
}

export function Header({ title }: HeaderProps) {
	return (
		<Flex
			className='horizontal'
			style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}
		>
			<BackBtn />
			<h1 className='section-heading' style={{ fontSize: '1.7em' }}>
				{title}
			</h1>
		</Flex>
	)
}
