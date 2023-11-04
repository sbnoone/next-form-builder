'use client'

import { useTransition } from 'react'
import { FaSpinner, FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

import { DeleteForm } from '@/actions/form'
import { toast } from './ui/use-toast'
import { Button } from './ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

export function FormDeleteBtn({ id }: { id: number }) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	const deleteForm = async () => {
		try {
			await DeleteForm(id)
			toast({
				title: 'Success',
				description: 'Form deleted successfuly',
			})
			router.replace('/')
		} catch (e) {
			toast({
				title: 'Error',
				description: 'Can not delete form, try again',
				variant: 'destructive',
			})
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='destructive'
					className='gap-3'
				>
					Delete form <FaTrash />
				</Button>
			</DialogTrigger>
			<DialogContent className='gap-y-3'>
				<DialogHeader>
					<DialogTitle>Delete form</DialogTitle>
					<DialogDescription>
						Are you sure about this? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className='flex gap-3'>
					<DialogClose asChild>
						<Button className='flex-1'>Cancel</Button>
					</DialogClose>
					<Button
						className='flex-1 gap-x-3'
						variant='destructive'
						onClick={() => startTransition(deleteForm)}
					>
						Proceed
						{pending && <FaSpinner className='animate-spin' />}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
