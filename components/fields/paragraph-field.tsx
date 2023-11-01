'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BsTextParagraph } from 'react-icons/bs'

import { ElementsType, FormElement, FormElementInstance } from '../form-elements'
import { Label } from '../ui/label'
import { useDesigner } from '@/hooks/use-designer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

const type: ElementsType = 'ParagraphField'

const extraAttributes = {
	text: 'Paragraph field',
}

export const ParagraphFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: BsTextParagraph,
		label: 'Paragraph field',
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	fieldOptionsForm: FieldOptionsForm,

	validate: () => true,
}

type CustomInstance = FormElementInstance & {
	extraAttributes: typeof extraAttributes
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { text } = element.extraAttributes
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className='text-muted-foreground'>Paragraph field</Label>
			<p className='truncate'>{text}</p>
		</div>
	)
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { text } = element.extraAttributes
	return <p className='text-muted-foreground'>{text}</p>
}

const FieldOptionsSchema = z.object({
	text: z.string().min(2).max(50),
})

type TFieldOptions = z.infer<typeof FieldOptionsSchema>

function FieldOptionsForm({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { updateElement } = useDesigner()
	const form = useForm<TFieldOptions>({
		resolver: zodResolver(FieldOptionsSchema),
		mode: 'onBlur',
		defaultValues: {
			text: element.extraAttributes.text,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { text } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				text,
			},
		})
	}

	return (
		<Form {...form}>
			<form
				onBlur={form.handleSubmit(onSubmit)}
				onSubmit={(e) => e.preventDefault()}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='text'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Text</FormLabel>
							<FormControl>
								<Textarea
									rows={5}
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur()
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
