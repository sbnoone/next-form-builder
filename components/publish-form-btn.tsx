import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'
import { MdOutlinePublish } from 'react-icons/md'

import { PublishForm } from '@/actions/form'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { FormElementInstance } from './form-elements'
import { FormContentSchema } from '@/schemas/form'

export default function PublishFormBtn({
	id,
	elements,
}: {
	id: number
	elements: FormElementInstance[]
}) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [loading, startTransition] = useTransition()
	const router = useRouter()

	const openConfirmDialog = () => {
		const validation = FormContentSchema.safeParse(elements)
		if (!validation.success) {
			toast({
				title: 'Error',
				description: 'Form cannot be empty',
				variant: 'destructive',
			})
			return
		}
		setDialogOpen(true)
	}

	const publishForm = async () => {
		try {
			const jsonContent = JSON.stringify(elements)
			await PublishForm(id, jsonContent)
			toast({
				title: 'Success',
				description: 'Your form is now available to the public',
			})
			router.refresh()
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Error while publishing your form, try again',
			})
		}
	}

	return (
		<AlertDialog open={dialogOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'
					onClick={openConfirmDialog}
				>
					<MdOutlinePublish className='h-4 w-4' />
					Publish
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. After publishing you will not be able to edit this form.{' '}
						<br />
						<br />
						<span className='font-medium'>
							By publishing this form you will make it available to the public and you will be able
							to collect submissions.
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setDialogOpen(false)}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						type='button'
						disabled={loading}
						onClick={(e) => {
							e.preventDefault()
							startTransition(publishForm)
						}}
					>
						Proceed {loading && <FaSpinner className='animate-spin' />}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
