import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
	return <div className='flex w-full flex-col flex-grow mx-auto'>{children}</div>
}
