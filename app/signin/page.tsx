'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

interface SignInProps {
	searchParams: { callbackUrl?: string }
}

export default function SignIn({ searchParams: { callbackUrl = '/' } }: SignInProps) {
	return (
		<div className='h-full flex flex-col place-content-center place-items-center'>
			<Card>
				<CardHeader>
					<CardTitle className='text-center'>Sign in</CardTitle>
				</CardHeader>
				<CardContent>
					<Button
						onClick={() => {
							signIn('google', { callbackUrl })
						}}
					>
						Sign in with Google
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
