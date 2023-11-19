'use client'

import { z } from 'zod'
import { useEffect, useId, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CgFileAdd } from 'react-icons/cg'
import { FaTrash } from 'react-icons/fa'

import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from '../form-elements'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useDesigner } from '@/hooks/use-designer'
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
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

const type: ElementsType = 'FileField'

const extraAttributes = {
	label: 'File field',
	helperText: 'Helper text',
	required: false,
	placeholder: 'Select file',
	maxSize: 2048,
}

export const FileFieldFormElement: FormElement = {
	type,
	construct: (id) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: CgFileAdd,
		label: 'File Field',
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	fieldOptionsForm: FieldOptionsForm,

	validate: (formElement: FormElementInstance, currentValue: File | null): boolean => {
		const element = formElement as CustomInstance
		if (element.extraAttributes.required) {
			return !!currentValue
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
			<Input
				type='file'
				readOnly
				disabled
				placeholder={placeholder}
			/>
			{helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
		</div>
	)
}

function FormComponent({
	elementInstance,
	submitValue,
	isInvalid,
}: {
	elementInstance: FormElementInstance
	submitValue?: SubmitFunction
	isInvalid?: boolean
}) {
	const element = elementInstance as CustomInstance

	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [value, setValue] = useState<File | null>(null)
	const [error, setError] = useState(false)
	const id = useId()

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, placeholder, helperText } = element.extraAttributes
	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label
				htmlFor={id}
				className={cn(error && 'text-destructive')}
			>
				{label}
				{required && '*'}
			</Label>
			<div className='flex gap-x-2 items-center'>
				<Input
					ref={fileInputRef}
					id={id}
					type='file'
					className={cn(error && 'text-destructive')}
					placeholder={placeholder}
					onChange={(e) => setValue(e.target.files?.[0] || null)}
					onBlur={(e) => {
						if (!submitValue) return
						const valid = FileFieldFormElement.validate(element, e.target.value)
						setError(!valid)
						if (!valid) return
						submitValue(element.id, e.target.value)
					}}
				/>
				{value && (
					<Button
						variant='destructive'
						type='button'
						onClick={() => {
							if (fileInputRef.current) {
								fileInputRef.current.value = ''
							}
							setValue(null)
						}}
					>
						<span className='sr-only'>Remove selected file</span>
						<FaTrash />
					</Button>
				)}
			</div>

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
	placeholder: z.string().max(50),
	maxSize: z.number().max(10000, 'Max file size must be less or equal to 10000 Kb'),
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
			placeholder: element.extraAttributes.placeholder,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { label, helperText, placeholder, required } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				helperText,
				placeholder,
				required,
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
					name='maxSize'
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>Max file size (Kb)</FormLabel>
							<FormControl>
								<Input
									className={cn(fieldState.error && 'border-destructive')}
									type='number'
									min={0}
									max={element.extraAttributes.maxSize}
									placeholder='Max file size'
									{...field}
									onChange={(e) => {
										field.onChange(Number(e.target.value))
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
								It will be displayed below the field
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
