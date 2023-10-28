import Auth from '@/components/auth'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Logo } from '@/components/logo'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from 'react'
import { LuView } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { GetFormStats } from '@/actions/form'

export default async function Home() {
	const stats = await GetFormStats()
	console.log('STATS', stats)
	return (
		<main className='min-h-screen flex flex-col bg-background'>
			<nav className='h-[60px] flex items-center justify-between px-3'>
				<Logo />
				<div className='flex items-center gap-x-2'>
					<ThemeModeToggle />
					<Auth />
				</div>
			</nav>
			<div className='container'>
				<div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
					<StatsCard
						title='Total visits'
						icon={<LuView className='text-blue-600' />}
						helperText='All time form visits'
						value={stats.visits.toLocaleString()}
						// loading={loading}
						className='shadow-md shadow-blue-600'
					/>

					<StatsCard
						title='Total submissions'
						icon={<FaWpforms className='text-yellow-600' />}
						helperText='All time form submissions'
						value={stats.submissions.toLocaleString()}
						// loading={loading}
						className='shadow-md shadow-yellow-600'
					/>

					<StatsCard
						title='Submission rate'
						icon={<HiCursorClick className='text-green-600' />}
						helperText='Visits that result in form submission'
						value={stats.submissionRate.toLocaleString()}
						// loading={loading}
						className='shadow-md shadow-green-600'
					/>
					<StatsCard
						title='Bounce rate'
						icon={<TbArrowBounce className='text-red-600' />}
						helperText='Visits that leaves without interacting'
						value={stats.bounceRate.toLocaleString()}
						// loading={loading}
						className='shadow-md shadow-red-600'
					/>
				</div>
			</div>
		</main>
	)
}

export function StatsCard({
	title,
	value,
	icon,
	helperText,
	loading,
	className,
}: {
	title: string
	value: string
	helperText: string
	className: string
	loading?: boolean
	icon: ReactNode
}) {
	return (
		<Card className={className}>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>
					{loading && (
						<Skeleton>
							<span className='opacity-0'>0</span>
						</Skeleton>
					)}
					{!loading && value}
				</div>
				<p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
			</CardContent>
		</Card>
	)
}
