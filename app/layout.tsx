import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import NextAuthProvider from '@/providers/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import DesignerContextProvider from '@/context/designer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Form Builder',
	description: 'Build and share your forms',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<NextAuthProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<DesignerContextProvider>
							{children}
							<Toaster />
						</DesignerContextProvider>
					</ThemeProvider>
				</NextAuthProvider>
			</body>
		</html>
	)
}
