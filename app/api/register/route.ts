import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
	const data: { email: string; password: string } = await req.json()

	if (!data.email || !data.password) {
		return new NextResponse('Bad credentials', { status: 400 })
	}

	const exist = await prisma.user.findUnique({
		where: {
			email: data.email,
		},
	})

	if (exist) {
		return new NextResponse('Bad credentials', { status: 400 })
	}

	const hashedPassword = await bcrypt.hash(data.password, 10)

	const newUser = await prisma.user.create({
		data: {
			email: data.email,
			password: hashedPassword,
		},
	})

	const { password, ...user } = newUser

	return NextResponse.json(user)
}
