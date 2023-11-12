'use client'

import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useDesigner } from '@/hooks/use-designer'
import { RxDropdownMenu } from 'react-icons/rx'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'

import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from '../form-elements'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

const type: ElementsType = 'SelectField'

const extraAttributes = {
	label: 'Select field',
	helperText: 'Helper text',
	required: false,
	placeholder: 'Value here...',
	options: [],
}

export const SelectFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: RxDropdownMenu,
		label: 'Select Field',
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
	const { label, required, placeholder, helperText } = element.extraAttributes
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label>
				{label}
				{required && '*'}
			</Label>
			<Select>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</Select>
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

	const [value, setValue] = useState(defaultValue || '')
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, placeholder, helperText, options } = element.extraAttributes
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className={cn(error && 'text-red-500')}>
				{label}
				{required && '*'}
			</Label>
			<Select
				defaultValue={value}
				onValueChange={(value) => {
					setValue(value)
					if (!submitValue) return
					const valid = SelectFieldFormElement.validate(element, value)
					setError(!valid)
					submitValue(element.id, value)
				}}
			>
				<SelectTrigger className={cn('w-full', error && 'border-red-500')}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem
							key={option}
							value={option}
						>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{helperText && (
				<p className={cn('text-muted-foreground text-[0.8rem]', error && 'text-red-500')}>
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
	placeholder: z.string().max(50),
	options: z.array(z.string()).default([]),
})

type TFieldOptions = z.infer<typeof FieldOptionsSchema>

function FieldOptionsForm({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { updateElement, setSelectedElement } = useDesigner()
	const form = useForm<TFieldOptions>({
		resolver: zodResolver(FieldOptionsSchema),
		mode: 'onSubmit',
		defaultValues: {
			label: element.extraAttributes.label,
			helperText: element.extraAttributes.helperText,
			required: element.extraAttributes.required,
			placeholder: element.extraAttributes.placeholder,
			options: element.extraAttributes.options,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { label, helperText, placeholder, required, options } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				helperText,
				placeholder,
				required,
				options,
			},
		})

		toast({
			title: 'Success',
			description: 'Properties saved successfully',
		})

		setSelectedElement(null)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
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
					name='placeholder'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Placeholder</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur()
									}}
								/>
							</FormControl>
							<FormDescription>The placeholder of the field</FormDescription>
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
				<Separator />
				<FormField
					control={form.control}
					name='options'
					render={({ field }) => (
						<FormItem>
							<div className='flex justify-between items-center'>
								<FormLabel>Options</FormLabel>
								<Button
									variant='outline'
									className='gap-2'
									onClick={(e) => {
										e.preventDefault() // avoid submit
										form.setValue('options', field.value.concat('New option'))
									}}
								>
									<AiOutlinePlus />
									Add
								</Button>
							</div>
							<div className='flex flex-col gap-2'>
								{form.watch('options').map((option, index) => (
									<div
										key={index}
										className='flex items-center justify-between gap-1'
									>
										<Input
											placeholder=''
											value={option}
											onChange={(e) => {
												field.value[index] = e.target.value
												field.onChange(field.value)
											}}
										/>
										<Button
											variant='ghost'
											size='icon'
											onClick={(e) => {
												e.preventDefault()
												const newOptions = [...field.value]
												newOptions.splice(index, 1)
												field.onChange(newOptions)
											}}
										>
											<AiOutlineClose />
										</Button>
									</div>
								))}
							</div>

							<FormDescription>
								The helper text of the field. <br />
								It will be displayed below the field.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Separator />
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
				<Separator />
				<Button
					className='w-full'
					type='submit'
				>
					Save
				</Button>
			</form>
		</Form>
	)
}
