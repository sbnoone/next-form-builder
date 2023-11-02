'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LuHeading1 } from 'react-icons/lu'

import { ElementsType, FormElement, FormElementInstance } from '../form-elements'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useDesigner } from '@/hooks/use-designer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

const type: ElementsType = 'TitleField'

const extraAttributes = {
	title: 'Title',
}

export const TitleFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: LuHeading1,
		label: 'Title Field',
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
	const { title } = element.extraAttributes
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className='text-muted-foreground'>Title field</Label>
			<p className='text-xl'>{title}</p>
		</div>
	)
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { title } = element.extraAttributes
	return <p className='text-xl'>{title}</p>
}

const FieldOptionsSchema = z.object({
	title: z.string().min(2).max(50),
})

type TFieldOptions = z.infer<typeof FieldOptionsSchema>

function FieldOptionsForm({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { updateElement } = useDesigner()
	const form = useForm<TFieldOptions>({
		resolver: zodResolver(FieldOptionsSchema),
		mode: 'onBlur',
		defaultValues: {
			title: element.extraAttributes.title,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { title } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				title,
			},
		})
	}

	return (
		<Form {...form}>
			<form
				onBlur={form.handleSubmit(onSubmit)}
				onSubmit={(e) => {
					e.preventDefault()
				}}
				className='space-y-3'
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
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
