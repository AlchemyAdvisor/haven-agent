import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Haven Agent — Voice-Driven Market Intelligence',
  description: 'AI-powered luxury real estate analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
