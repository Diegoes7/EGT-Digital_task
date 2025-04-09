import { useNavigate } from 'react-router-dom'
import { ArrowRightOutlined, LeftCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'

// Send it back one step
export function BackBtn() {
	const navigate = useNavigate()
	const handleBack = () => {
		navigate(-1)
	}

	return (
		<Button onClick={handleBack}>
			<LeftCircleOutlined />
			Go Back
		</Button>
	)
}

type Props = {
	to: string
	label?: string
}

// Send it to certain location
export function NavBtn({ to, label = 'Go Tasks' }: Props) {
	const navigate = useNavigate()

	const handleBack = () => {
		navigate(to)
	}

	return (
		<Button onClick={handleBack}>
			{label}
			<ArrowRightOutlined />
		</Button>
	)
}
