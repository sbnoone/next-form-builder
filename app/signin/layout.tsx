import { PropsWithChildren } from 'react'

import { Logo } from '@/components/logo'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'

export default function Layout({ children }: PropsWithChildren) {
	return (
		<div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
			<nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
				<Logo />
				<ThemeModeToggle />
			</nav>
			<main className='flex justify-center items-center w-full flex-grow'>{children}</main>
		</div>
	)
}