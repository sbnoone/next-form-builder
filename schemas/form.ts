import { z } from 'zod'

export const FormSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
})

export type TFormSchema = z.infer<typeof FormSchema>
