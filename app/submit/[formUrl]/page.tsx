import { GetFormContentByUrl } from '@/actions/form'
import { FormElementInstance } from '@/components/form-elements'
import FormSubmitComponent from '@/components/form-submit'

export default async function FormSubmitPage({
	params,
}: {
	params: {
		formUrl: string
	}
}) {
	const form = await GetFormContentByUrl(params.formUrl)

	if (!form) {
		throw new Error('form not found')
	}

	console.log(form)
	const formContent = JSON.parse(form.content) as FormElementInstance[]

	return (
		<FormSubmitComponent
			formUrl={params.formUrl}
			content={formContent}
		/>
	)
}
