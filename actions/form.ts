'use server'

import { getServerSession } from 'next-auth'

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

export async function GetFormStats() {
	const session = await getServerSession(authOptions)
	if (!session?.user) {
		throw new UserNotFoundError()
	}

	const stats = await prisma.form.aggregate({
		where: {
			user_id: session.user.id,
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
		submissionRate = (submissions / visits) * 100
	}

	const bounceRate = 100 - submissionRate

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

	const session = await getServerSession(authOptions)
	if (!session?.user.id) {
		throw new UserNotFoundError()
	}

	const { name, description } = values

	const form = await prisma.form.create({
		data: {
			name,
			description,
			user_id: session.user.id,
		},
	})

	return form.id
}

export async function GetForms() {
	const session = await getServerSession(authOptions)
	if (!session?.user.id) {
		throw new UserNotFoundError()
	}

	const forms = await prisma.form.findMany({
		where: {
			user_id: session.user.id,
		},
		orderBy: {
			created_at: 'desc',
		},
	})

	return forms
}

export async function GetFormById(id: number) {
	const session = await getServerSession(authOptions)
	if (!session?.user.id) {
		throw new UserNotFoundError()
	}

	const form = await prisma.form.findUnique({
		where: {
			id,
			user_id: session.user.id,
		},
	})

	return form
}

export async function UpdateFormContent(id: number, jsonContent: string) {
	const session = await getServerSession(authOptions)
	if (!session?.user.id) {
		throw new UserNotFoundError()
	}

	const form = await prisma.form.update({
		where: {
			user_id: session.user.id,
			id,
		},
		data: {
			content: jsonContent,
		},
	})

	return form
}

export async function PublishForm(id: number) {
	const session = await getServerSession(authOptions)
	if (!session?.user.id) {
		throw new UserNotFoundError()
	}

	return await prisma.form.update({
		data: {
			published: true,
		},
		where: {
			user_id: session.user.id,
			id,
		},
	})
}
