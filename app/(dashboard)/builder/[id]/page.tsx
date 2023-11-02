import { notFound } from 'next/navigation'

import { GetFormById } from '@/actions/form'
import FormBuilder from '@/components/form-builder'

export default async function FormBuilderPage({
	params,
}: {
	params: {
		id: string
	}
}) {
	const { id } = params
	const form = await GetFormById(Number(id))
	if (!form) {
		notFound()
	}
	return <FormBuilder form={form} />
}
