import Link from 'next/link'

export const Logo = () => {
	return (
		<Link
			href='/'
			className='font-bold text-3xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'
		>
			FormBuilder
		</Link>
	)
}
