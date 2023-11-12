'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { IoMdRadioButtonOn } from 'react-icons/io'

import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from '../form-elements'
import { useDesigner } from '@/hooks/use-designer'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'

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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { toast } from '../ui/use-toast'

const type: ElementsType = 'RadioGroupField'

const extraAttributes = {
	label: 'Radio group field',
	helperText: 'Radio group helper text',
	required: false,
	options: [
		{ label: 'Yes', value: 'true' },
		{ label: 'No', value: 'false' },
	],
}

export const RadioGroupFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: IoMdRadioButtonOn,
		label: 'Radio group',
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	fieldOptionsForm: FieldOptionsForm,

	/** Function to validate form when its previewed or published */
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
/** Component that displayed when dropped from sidebar to form builder */
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
	const element = elementInstance as CustomInstance
	const { label, required, helperText, options } = element.extraAttributes
	const id = `radio-group-${element.id}`
	return (
		<div className='flex flex-col gap-3 space-x-2'>
			<div className='grid gap-1.5 leading-none'>
				<Label htmlFor={id}>
					{label}
					{required && '*'}
				</Label>
			</div>
			<RadioGroup>
				{options.map(({ value, label }, index) => (
					<div
						key={value}
						className='flex items-center space-x-2'
					>
						<RadioGroupItem
							value={value}
							id={`id-${index}`}
						/>
						<Label htmlFor={`id-${index}`}>{label}</Label>
					</div>
				))}
			</RadioGroup>
			{helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
		</div>
	)
}

/** Component that displayed on published and preview form */
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

	const [value, setValue] = useState<string>(defaultValue || '')
	const [error, setError] = useState(false)

	useEffect(() => {
		setError(isInvalid === true)
	}, [isInvalid])

	const { label, required, helperText, options } = element.extraAttributes

	console.log(options)

	const id = `radio-group-${element.id}`
	return (
		<div className='flex flex-col gap-3 space-x-2'>
			<div className='grid gap-1.5 leading-none'>
				<Label
					htmlFor={id}
					className={cn(error && 'text-destructive')}
				>
					{label}
					{required && '*'}
				</Label>
			</div>
			<RadioGroup
				defaultValue={value}
				onValueChange={(value) => {
					setValue(value)
					if (!submitValue) return
					const valid = RadioGroupFieldFormElement.validate(element, value)
					setError(!valid)
					submitValue(element.id, value)
				}}
			>
				{options.map(({ label, value }, index) => (
					<div
						key={value}
						className='flex items-center space-x-2'
					>
						<RadioGroupItem
							value={value}
							id={`id-${index}`}
						/>
						<Label htmlFor={`id-${index}`}>{label}</Label>
					</div>
				))}
			</RadioGroup>
			{helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
		</div>
	)
}

const FieldOptionsSchema = z.object({
	label: z.string().min(2).max(50),
	helperText: z.string().max(200),
	required: z.boolean().default(false),
	options: z
		.array(
			z.object({
				label: z.string().max(30).min(1),
				value: z.string().max(30).min(1),
			})
		)
		.default([]),
})

type TFieldOptions = z.infer<typeof FieldOptionsSchema>

/** Component that displayed in sidebar where its properties can be edited */
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
			options: element.extraAttributes.options,
		},
	})

	useEffect(() => {
		form.reset(element.extraAttributes)
	}, [element, form])

	const onSubmit: SubmitHandler<TFieldOptions> = (values) => {
		const { label, helperText, required, options } = values
		updateElement(element.id, {
			...element,
			extraAttributes: {
				label,
				helperText,
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
					render={({ field, formState }) => {
						const optionErrors = formState.errors.options
						return (
							<FormItem>
								<div className='flex justify-between items-center'>
									<FormLabel>Options</FormLabel>
									<Button
										variant='outline'
										className='gap-2'
										onClick={(e) => {
											e.preventDefault() // avoid submit
											form.setValue('options', [
												...field.value,
												{ label: 'New option', value: 'new value' },
											])
										}}
									>
										<AiOutlinePlus />
										Add
									</Button>
								</div>
								<div className='flex flex-col gap-2'>
									{form.watch('options').map(({ label, value }, index, options) => {
										return (
											<div
												key={index}
												className='flex gap-1'
											>
												<div className='flex flex-col flex-1 gap-1'>
													<div className='flex-1'>
														<Input
															className={cn(optionErrors?.[index]?.label && 'border-destructive')}
															placeholder='Option label'
															value={label}
															onChange={(e) => {
																field.value[index].label = e.target.value
																field.onChange(field.value)
															}}
														/>
														{optionErrors?.[index]?.label?.message && (
															<p className='text-destructive text-xs'>
																{optionErrors?.[index]?.label?.message}
															</p>
														)}
													</div>
													<div className='flex-1'>
														<Input
															className={cn(optionErrors?.[index]?.value && 'border-destructive')}
															placeholder='Option value'
															value={value}
															onChange={(e) => {
																field.value[index].value = e.target.value
																field.onChange(field.value)
															}}
														/>
														{optionErrors?.[index]?.value?.message && (
															<p className='border-destructive'>
																{optionErrors?.[index]?.value?.message}
															</p>
														)}
													</div>
												</div>
												<Button
													className='h-auto flex-shrink-0'
													variant='outline'
													size='icon'
													disabled={options.length === 2}
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
										)
									})}
								</div>
							</FormItem>
						)
					}}
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
