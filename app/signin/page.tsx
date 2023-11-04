'use client'

import { signIn } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImSpinner2 } from 'react-icons/im'

import { Button } from '@/components/ui/button'
import GoogleSvg from '@/public/google.svg'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

interface SignInProps {
	searchParams: { callbackUrl?: string }
}

const SigninFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

type TSigninFromSchema = z.infer<typeof SigninFormSchema>

export default function SignIn({ searchParams: { callbackUrl = '/' } }: SignInProps) {
	const form = useForm<TSigninFromSchema>({
		values: {
			email: '',
			password: '',
		},
		resolver: zodResolver(SigninFormSchema),
	})

	const onSubmit: SubmitHandler<TSigninFromSchema> = async (values) => {
		try {
			await signIn('credentials', {
				...values,
				callbackUrl,
			})
		} catch (e) {
			toast({
				title: 'Sign in error',
				description: 'Please try again',
				variant: 'destructive',
			})
		}
	}

	return (
		<div className='h-full flex flex-col place-content-center place-items-center min-w-[320px]'>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle className='text-center'>Sign in</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								name='email'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												className='h-12 text-base'
												type='email'
												placeholder='Enter email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name='password'
								control={form.control}
								render={({ field }) => (
									<FormItem className='mt-2'>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												className='h-12 text-base'
												type='password'
												placeholder='Enter password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='submit'
								className='mt-4 w-full text-center h-12 gap-x-2'
								disabled={form.formState.isSubmitting}
							>
								Sign in
								{form.formState.isSubmitting && <ImSpinner2 className='animate-spin' />}
							</Button>
						</form>
					</Form>
					<div className='flex items-center pt-4 before:border-b before:flex-1 before:w-full  after:border-b after:flex-1  after:w-full after:block'>
						<span className='flex-[0.2_0_auto] text-center uppercase'>OR</span>
					</div>
					<div className='mt-4'>
						<Button
							className='h-12 gap-x-2 w-full'
							onClick={() => {
								signIn('google', { callbackUrl })
							}}
						>
							<GoogleSvg /> Continue with Google
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
