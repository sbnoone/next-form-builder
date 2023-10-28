'use client'

import { signOut, useSession } from 'next-auth/react'
import { AvatarIcon } from '@radix-ui/react-icons'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Auth() {
	const { data } = useSession()

	console.log(data?.user)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className='w-[32px] h-[32px] rounded-full '>
					<AvatarImage src={data?.user?.image || ''} />
					<AvatarFallback>
						<AvatarIcon className='w-[24px] h-[24px]' />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
