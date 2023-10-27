'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function Auth() {
	const { data, status, update } = useSession()

	if (data) {
		return (
			<Button
				onClick={() => {
					signOut()
				}}
			>
				Sign out
			</Button>
		)
	}

	return (
		<Button
			onClick={() => {
				signIn()
			}}
		>
			Sign in
		</Button>
	)
}
