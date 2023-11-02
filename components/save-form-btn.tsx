import { useTransition } from 'react'
import { HiSaveAs } from 'react-icons/hi'
import { FaSpinner } from 'react-icons/fa'

import { UpdateFormContent } from '@/actions/form'
import { Button } from './ui/button'
import { useDesigner } from '../hooks/use-designer'
import { toast } from './ui/use-toast'
import { FormContentSchema } from '@/schemas/form'

export default function SaveFormBtn({ id }: { id: number }) {
	const { elements } = useDesigner()
	const [loading, startTransition] = useTransition()

	const handleSave = () => {
		const validation = FormContentSchema.safeParse(elements)
		if (!validation.success) {
			toast({
				title: 'Error',
				description: 'Form cannot be empty',
				variant: 'destructive',
			})
			return
		}
		startTransition(updateFormContent)
	}

	const updateFormContent = async () => {
		try {
			const jsonElements = JSON.stringify(elements)
			await UpdateFormContent(id, jsonElements)
			toast({
				title: 'Success',
				description: 'Your form has been saved',
			})
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			})
		}
	}
	return (
		<Button
			variant='outline'
			className='gap-2'
			disabled={loading}
			onClick={handleSave}
		>
			{loading && <FaSpinner className='animate-spin' />}
			{!loading && <HiSaveAs className='h-4 w-4' />}
			Save
		</Button>
	)
}
