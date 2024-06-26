import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'

const defaultUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s | Portfolio',
    default: 'Portfolio',
  },
  description: 'Portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} style={{ colorScheme: 'dark' }}>
      <body className="bg-background text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReactQueryProvider>
            <NavBar />
            <main className="flex flex-col items-center p-4 md:p-6 lg:p-8">{children}</main>
            {/* <Footer /> */}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            <Toaster richColors />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
