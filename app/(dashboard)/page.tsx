import User from '@/components/user'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Logo } from '@/components/logo'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
	CardFooter,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode, Suspense } from 'react'
import { LuView } from 'react-icons/lu'
import { FaEdit, FaWpforms } from 'react-icons/fa'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { GetFormStats, GetForms } from '@/actions/form'
import CreateFormButton from '@/components/create-form-button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Form } from '@prisma/client'
import { BiRightArrowAlt } from 'react-icons/bi'

export default async function Home() {
	return (
		<div className='container'>
			<Suspense fallback={<StatsCards loading />}>
				<StatsCardsWithData />
			</Suspense>
			<Separator className='my-6' />
			<h1 className='font-bold text-4xl'>Your forms</h1>
			<div className='grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
				<CreateFormButton />
				<Suspense
					fallback={[1, 2, 3, 4].map((el) => (
						<FormCardSkeleton key={el} />
					))}
				>
					<FormCards />
				</Suspense>
			</div>
		</div>
	)
}

interface StatsCardsProps {
	data?: Awaited<ReturnType<typeof GetFormStats>>
	loading?: boolean
}

export async function StatsCardsWithData() {
	const stats = await GetFormStats()
	return <StatsCards data={stats} />
}

export function StatsCards({ data, loading }: StatsCardsProps) {
	return (
		<div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
			<StatsCard
				title='Total visits'
				icon={<LuView className='text-blue-600' />}
				helperText='All time form visits'
				value={data?.visits.toLocaleString() || ''}
				loading={loading}
				className='shadow-md shadow-blue-600'
			/>

			<StatsCard
				title='Total submissions'
				icon={<FaWpforms className='text-yellow-600' />}
				helperText='All time form submissions'
				value={data?.submissions.toLocaleString() || ''}
				loading={loading}
				className='shadow-md shadow-yellow-600'
			/>

			<StatsCard
				title='Submission rate'
				icon={<HiCursorClick className='text-green-600' />}
				helperText='Visits that result in form submission'
				value={data?.submissionRate.toLocaleString() || ''}
				loading={loading}
				className='shadow-md shadow-green-600'
			/>
			<StatsCard
				title='Bounce rate'
				icon={<TbArrowBounce className='text-red-600' />}
				helperText='Visits that leaves without interacting'
				value={data?.bounceRate.toLocaleString() || ''}
				loading={loading}
				className='shadow-md shadow-red-600'
			/>
		</div>
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

function FormCardSkeleton() {
	return <Skeleton className='border-2 border-primary-/20 h-[190px] w-full' />
}

async function FormCards() {
	const forms = await GetForms()
	return (
		<>
			{forms.map((form) => (
				<FormCard
					key={form.id}
					form={form}
				/>
			))}
		</>
	)
}

function FormCard({ form }: { form: Form }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 justify-between'>
					<span className='truncate font-bold'>{form.name}</span>
					{form.published && <Badge>Published</Badge>}
					{!form.published && <Badge variant={'destructive'}>Draft</Badge>}
				</CardTitle>
				<CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
					{formatDistance(form.created_at, new Date(), {
						addSuffix: true,
					})}
					{form.published && (
						<span className='flex items-center gap-2'>
							<LuView className='text-muted-foreground' />
							<span>{form.visits.toLocaleString()}</span>
							<FaWpforms className='text-muted-foreground' />
							<span>{form.submissions.toLocaleString()}</span>
						</span>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
				{form.description || 'No description'}
			</CardContent>
			<CardFooter>
				{form.published && (
					<Button
						asChild
						className='w-full mt-2 text-md gap-4'
					>
						<Link href={`/forms/${form.id}`}>
							View submissions <BiRightArrowAlt />
						</Link>
					</Button>
				)}
				{!form.published && (
					<Button
						asChild
						variant='secondary'
						className='w-full mt-2 text-md gap-4'
					>
						<Link href={`/builder/${form.id}`}>
							Edit form <FaEdit />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}
