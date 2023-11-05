import withAuth from 'next-auth/middleware'

export const config = {
	matcher: ['/((?!signup|api|_next|static|favicon.ico).*)'],
}

export default withAuth({
	pages: {
		signIn: '/signin',
	},
})
