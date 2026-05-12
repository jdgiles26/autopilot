import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Autopilot — Autonomous AI Workflow Platform',
  description:
    'Next-generation, fully autonomous AI platform for orchestrating complex software life-cycles and workflow automations with zero friction.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <div className="grid-background" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
