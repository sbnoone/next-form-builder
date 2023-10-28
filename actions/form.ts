'use server'

import { getServerSession } from 'next-auth'

import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

class UserNotFoundError extends Error {
	constructor() {
		super()
		this.message = 'User not found.'
		this.name = 'UserNotFoundError'
	}
}

export async function GetFormStats() {
	const session = await getServerSession(authOptions)
	// console.log('GET FORM STATS', session)
	// return {}
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
