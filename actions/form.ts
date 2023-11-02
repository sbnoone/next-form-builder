'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { FormSchema, TFormSchema } from '@/schemas/form'

class UserNotFoundError extends Error {
	constructor() {
		super()
		this.message = 'User not found.'
		this.name = 'UserNotFoundError'
	}
}
async function getUser() {
	const session = await getServerSession(authOptions)
	return session?.user
}

export async function GetFormStats() {
	const user = await getUser()

	if (!user) {
		throw new UserNotFoundError()
	}

	const stats = await prisma.form.aggregate({
		where: {
			user_id: user.id,
		},
		_sum: {
			visits: true,
			submissions: true,
		},
	})

	const visits = stats._sum.visits || 0
	const submissions = stats._sum.submissions || 0

	let submissionRate = 0

	if (visits > 0) {
		submissionRate = submissions / visits
	}

	const bounceRate = 1 - submissionRate

	return {
		visits,
		submissions,
		submissionRate,
		bounceRate,
	}
}

export async function CreateForm(values: TFormSchema) {
	const valid = FormSchema.safeParse(values)
	if (!valid.success) {
		throw new Error('form not valid')
	}

	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	const { name, description } = values

	const form = await prisma.form.create({
		data: {
			name,
			description,
			user_id: user.id,
		},
	})

	return form.id
}

export async function GetForms() {
	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	const forms = await prisma.form.findMany({
		where: {
			user_id: user.id,
		},
		orderBy: {
			created_at: 'desc',
		},
	})

	return forms
}

export async function GetFormById(id: number) {
	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	const form = await prisma.form.findUnique({
		where: {
			id,
			user_id: user.id,
		},
	})

	return form
}

export async function UpdateFormContent(id: number, jsonContent: string) {
	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	const form = await prisma.form.update({
		where: {
			user_id: user.id,
			id,
		},
		data: {
			content: jsonContent,
		},
	})
	revalidatePath('/')
	return form
}

export async function PublishForm(id: number) {
	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	return await prisma.form.update({
		data: {
			published: true,
		},
		where: {
			user_id: user.id,
			id,
		},
	})
}

export async function GetFormContentByUrl(formUrl: string) {
	return await prisma.form.update({
		select: {
			content: true,
		},
		data: {
			visits: {
				increment: 1,
			},
		},
		where: {
			shareURL: formUrl,
		},
	})
}

export async function SubmitForm(formUrl: string, content: string) {
	return await prisma.form.update({
		data: {
			submissions: {
				increment: 1,
			},
			FormSubmissions: {
				create: {
					content,
				},
			},
		},
		where: {
			shareURL: formUrl,
			published: true,
		},
	})
}

export async function GetFormWithSubmissions(id: number) {
	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	return await prisma.form.findUnique({
		where: {
			user_id: user.id,
			id,
		},
		include: {
			FormSubmissions: true,
		},
	})
}

export async function DeleteForm(id: number) {
	const user = await getUser()
	if (!user?.id) {
		throw new UserNotFoundError()
	}

	await prisma.form.delete({
		where: {
			id,
			user_id: user.id,
		},
	})
}
