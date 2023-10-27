'use client'

import Auth from '@/components/auth'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Logo } from '@/components/logo'

export default function Home() {
	return (
		<main className='min-h-screen flex flex-col bg-background'>
			<nav className='h-[60px] flex items-center justify-between'>
				<Logo />
				<div className='flex items-center gap-x-2'>
					<ThemeModeToggle />
					<Auth />
				</div>
			</nav>
		</main>
	)
}
