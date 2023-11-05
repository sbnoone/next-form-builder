'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImSpinner2 } from 'react-icons/im'

import { Button } from '@/components/ui/button'
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
import { useRouter } from 'next/navigation'

const SignupFormSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(6, 'Password must contain at least 6 characters'),
		confirmPassword: z.string(),
	})
	.refine(
		({ password, confirmPassword }) => {
			return password === confirmPassword
		},
		{ message: 'Passwords must match', path: ['confirmPassword'] }
	)

type TSignupFromSchema = z.infer<typeof SignupFormSchema>

export default function SignUp() {
	const router = useRouter()
	const form = useForm<TSignupFromSchema>({
		values: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		resolver: zodResolver(SignupFormSchema),
	})

	const onSubmit: SubmitHandler<TSignupFromSchema> = async (values) => {
		try {
			const res = await fetch(`/api/register`, {
				body: JSON.stringify(values),
				method: 'POST',
				headers: { 'content-type': 'application/json' },
			})
			const user = await res.json()
			console.log('user', user)
			toast({
				title: 'Success',
				description: 'You can signin now',
			})
			router.push('/signin')
		} catch (e) {
			toast({
				title: 'Sign up error',
				description: 'Please try again',
				variant: 'destructive',
			})
		}
	}

	return (
		<div className='h-full flex flex-col place-content-center place-items-center min-w-[320px]'>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle className='text-center'>Sign up</CardTitle>
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
							<FormField
								name='confirmPassword'
								control={form.control}
								render={({ field }) => (
									<FormItem className='mt-2'>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input
												className='h-12 text-base'
												type='password'
												placeholder='Confirm password'
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
								Sign up
								{form.formState.isSubmitting && <ImSpinner2 className='animate-spin' />}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
