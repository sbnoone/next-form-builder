'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { IoMdSwitch } from 'react-icons/io'

import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from '../form-elements'
import { useDesigner } from '@/hooks/use-designer'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { Switch } from '../ui/switch'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'

const type: ElementsType = 'SwitchField'

const extraAttributes = {
	label: 'Switch field',
	helperText: 'Switch field helper text',
	required: false,
}

export const SwitchFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: IoMdSwitch,
		label: 'Switch Field',
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	fieldOptionsForm: FieldOptionsForm,

	validate: (formElement: FormElementInstance, currentValue: string): boolean => {
		const element = formElement as CustomInstance
		if (element.extraAttributes.required) {
			return currentValue.length > 0
		}

		return true
	},
}

type CustomInstance = FormElementInstance & {
	extraAttributes: typeof extraAttributes
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { label, required, helperText } = element.extraAttributes
	const id = `switch-${element.id}`
	return (
		<div className='flex flex-col space-y-2'>
			<Label htmlFor={id}>
				{label}
				{required && '*'}
			</Label>
			<Switch id={id} />
			{helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
		</div>
	)
}

function FormComponent({
	elementInstance,
	submitValue,
	isInvalid,
	defaultValue,
}: {
	elementInstance: FormElementInstance
	submitValue?: SubmitFunction
	isInvalid?: boolean
	defaultValue?: string
}) {
	const element = elementInstance as CustomInstance

	const [value, setValue] = useState<boolean>(defaultValue === 'true')
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, helperText } = element.extraAttributes
	const id = `switch-${element.id}`
	return (
		<div className='flex flex-col space-y-2'>
			<Label
				htmlFor={id}
				className={cn(error && 'text-destructive')}
			>
				{label}
				{required && '*'}
			</Label>
			<Switch
				id={id}
				value={value ? 'on' : 'off'}
				className={cn(error && 'border-red-500')}
				onCheckedChange={(checked) => {
					let value = false
					if (checked === true) value = true

					setValue(value)
					if (!submitValue) return
					const stringValue = value ? 'true' : 'false'
					const valid = SwitchFieldFormElement.validate(element, stringValue)
					setError(!valid)
					submitValue(element.id, stringValue)
				}}
			/>
			{helperText && (
				<p className={cn('text-muted-foreground text-[0.8rem]', error && 'text-destructive')}>
					{helperText}
				</p>
			)}
		</div>
	)
}

const FieldOptionsSchema = z.object({
	label: z.string().min(2).max(50),
	helperText: z.string().max(200),
	required: z.boolean().default(false),
})

type TFieldOptions = z.infer<typeof FieldOptionsSchema>

function FieldOptionsForm({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { updateElement } = useDesigner()
	const form = useForm<TFieldOptions>({
		resolver: zodResolver(FieldOptionsSchema),
		mode: 'onBlur',
		defaultValues: {
			label: element.extraAttributes.label,
			helperText: element.extraAttributes.helperText,
			required: element.extraAttributes.required,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { label, helperText, required } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				helperText,
				required,
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
					name='label'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Label</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur()
									}}
								/>
							</FormControl>
							<FormDescription>
								The label of the field. <br /> It will be displayed above the field
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='helperText'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Helper text</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur()
									}}
								/>
							</FormControl>
							<FormDescription>
								The helper text of the field. <br />
								It will be displayed below the field.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='required'
					render={({ field }) => (
						<FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm space-y-0'>
							<FormLabel>Required</FormLabel>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
