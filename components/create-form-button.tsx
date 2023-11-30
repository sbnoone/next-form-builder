'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { useRouter, useSearchParams } from 'next/navigation'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { ImSpinner2 } from 'react-icons/im'

import { FormSchema, type TFormSchema } from '@/schemas/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { toast } from './ui/use-toast'
import { CreateForm } from '@/actions/form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

export default function CreateFormButton() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const form = useForm<TFormSchema>({
		resolver: zodResolver(FormSchema),
	})

	const onSubmit: SubmitHandler<TFormSchema> = async (values) => {
		try {
			const formId = await CreateForm(values)
			toast({
				title: 'Success',
				description: 'Form created successfully',
			})
			router.push(`/builder/${formId}`)
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong, please try again later',
				variant: 'destructive',
			})
		}
	}

	const isCreateFormModalOpen = searchParams.get('modal') === 'createForm'

	return (
		<Dialog
			defaultOpen={isCreateFormModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					router.replace('/')
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						router.replace(`?${new URLSearchParams({ modal: 'createForm' }).toString()}`)
					}}
					variant='outline'
					className='group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4'
				>
					<BsFileEarmarkPlus className='h-8 w-8 text-muted-foreground group-hover:text-primary' />
					<p className='font-bold text-xl text-muted-foreground group-hover:text-primary'>
						Create new form
					</p>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create form</DialogTitle>
					<DialogDescription>Create a new form to start collecting responses</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-2'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className='max-h-96'
											rows={5}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button
						onClick={form.handleSubmit(onSubmit)}
						disabled={form.formState.isSubmitting}
						className='w-full mt-4'
					>
						{!form.formState.isSubmitting && <span>Save</span>}
						{form.formState.isSubmitting && <ImSpinner2 className='animate-spin' />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
