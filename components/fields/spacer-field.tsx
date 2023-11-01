'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LuSeparatorHorizontal } from 'react-icons/lu'

import { ElementsType, FormElement, FormElementInstance } from '../form-elements'
import { Label } from '../ui/label'
import { useDesigner } from '@/hooks/use-designer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Slider } from '../ui/slider'

const type: ElementsType = 'SubTitleField'

const extraAttributes = {
	height: 20, // px
}

export const SpacerFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: LuSeparatorHorizontal,
		label: 'Spacer Field',
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
	const { height } = element.extraAttributes
	return (
		<div className='flex flex-col gap-2 w-full items-center'>
			<Label className='text-muted-foreground'>Spacer field: {height}px</Label>
			<LuSeparatorHorizontal className='h-8 w-8' />
		</div>
	)
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { height } = element.extraAttributes
	return <div style={{ height, width: '100%' }} />
}

const FieldOptionsSchema = z.object({
	height: z.number().min(1).max(100),
})

type TFieldOptions = z.infer<typeof FieldOptionsSchema>

function FieldOptionsForm({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { updateElement } = useDesigner()
	const form = useForm<TFieldOptions>({
		resolver: zodResolver(FieldOptionsSchema),
		mode: 'onBlur',
		defaultValues: {
			height: element.extraAttributes.height,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { height } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				height,
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
					name='height'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Height (px): {form.watch('height')}</FormLabel>
							<FormControl className='pt-2'>
								<Slider
									defaultValue={[field.value]}
									min={5}
									max={200}
									step={1}
									onValueChange={(value) => {
										field.onChange(value[0])
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
