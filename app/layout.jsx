import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: 'LifeOS - Your Personal Operating System',
  description: 'A comprehensive personal OS for managing goals, finances, and your life journey',
  generator: 'v0.app',
  icons: {
    icon:[
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

// Next 14+ reads viewport from this export (not from `metadata`)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0d0d0d',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="fixed inset-0 bg-background -z-10">
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1000 1000">
            <defs>
              <pattern id="geo-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="currentColor" strokeWidth="1"/>
                <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="1000" height="1000" fill="url(#geo-pattern)" opacity="0.3"/>
          </svg>
        </div>
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
