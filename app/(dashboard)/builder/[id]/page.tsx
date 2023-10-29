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
		throw new Error('form not found')
	}
	return <FormBuilder form={form} />
}
