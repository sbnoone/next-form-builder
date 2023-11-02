'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
	return (
		<div className='flex w-full h-full flex-col items-center justify-center gap-4'>
			<h2 className='text-destructive text-4xl'>Form not found</h2>
			<Button asChild>
				<Link href='/'>Go back to home</Link>
			</Button>
		</div>
	)
}
