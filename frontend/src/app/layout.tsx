import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Last Man Standing - DApp',
  description: 'A decentralized last man standing game with VRF and Blocklock on Base Sepolia',
  keywords: ['blockchain', 'game', 'DeFi', 'Base', 'Ethereum', 'VRF', 'Blocklock'],
  authors: [{ name: 'Last Man Standing Team' }],
  openGraph: {
    title: 'Last Man Standing - DApp',
    description: 'The only way you lose is if you stop playing!',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <head>
        {/* <link rel="icon" href={logo.src} /> */}
        <link rel="icon" type="image/png" href="/favicon.png"></link>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}