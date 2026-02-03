import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ReduxProvider from "@/components/redux-provider"
import Footer from "./components/Footer"
import ConditionalHeader from "@/components/conditional-header"
import { Toaster } from "@/components/ui/toaster"
import { Playfair_Display, Dancing_Script, Quicksand } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dancing.variable} ${quicksand.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ReduxProvider>
          <ConditionalHeader />
          {children}
          <Footer />
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  )
}
