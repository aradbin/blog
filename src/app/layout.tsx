import { GeistSans } from 'geist/font/sans'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const defaultUrl = process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3000'

export const metadata = {
  applicationName: 'Portfolio',
  metadataBase: new URL(defaultUrl),
  title: {
    default: 'Portfolio',
    template: '%s | Portfolio',
  },
  description: 'Portfolio Management App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Portfolio',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Portfolio',
    title: {
      default: 'Portfolio',
      template: '%s | Portfolio',
    },
    description: 'Portfolio Management App',
  },
  twitter: {
    card: 'summary',
    title: {
      default: 'Portfolio',
      template: '%s | Portfolio',
    },
    description: 'Portfolio Management App',
  },
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
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
