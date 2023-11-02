import { z } from 'zod'

export const FormSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
})

export type TFormSchema = z.infer<typeof FormSchema>

export const FormContentSchema = z
	.array(
		z.object({
			id: z.string(),
			type: z.string(),
			extraAttributes: z.object({}).optional(),
		})
	)
	.nonempty()

export type TFormContentSchema = z.infer<typeof FormContentSchema>
