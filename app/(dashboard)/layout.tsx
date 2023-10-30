import { ReactNode } from 'react'

import { Logo } from '@/components/logo'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import User from '@/components/user'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
			<nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
				<Logo />
				<div className='flex gap-4 items-center'>
					<ThemeModeToggle />
					<User />
				</div>
			</nav>
			<main className='flex w-full flex-grow'>{children}</main>
		</div>
	)
}
