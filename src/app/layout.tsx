import type React from "react"
import type { Metadata } from "next"
import { Roboto, Roboto_Flex } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"

// Roboto estándar
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
})

// Roboto Flex (más opciones de personalización)
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
})

export const metadata: Metadata = {
  title: {
    default: "Level UPDS - Evaluación Automática de Programación",
    template: "%s | Level UPDS",
  },
  description:
    "Plataforma moderna para la evaluación automática de ejercicios de programación en la UPDS. Mejora tu aprendizaje con retroalimentación inmediata, Juez en Línea (Judge0) y métricas de rendimiento.",
  keywords: [
    "UPDS",
    "Programación",
    "Evaluación Automática",
    "Judge0",
    "Educación",
    "Ingeniería de Sistemas",
    "Cochabamba",
    "Bolivia",
    "Online Judge",
    "Aprender a programar",
  ],
  authors: [{ name: "UPDS Cochabamba" }],
  creator: "UPDS Ingeniería de Sistemas",
  publisher: "Universidad Privada Domingo Savio",
  icons: {
    icon: [
      {
        url: "/bg-upds.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/bg-upds.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/bg-upds.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/bg-upds.png",
  },
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: "https://level-upds.vercel.app",
    title: "Level UPDS - Plataforma de Evaluación Automática",
    description:
      "Moderniza el aprendizaje de programación con retroalimentación instantánea y entornos estandarizados.",
    siteName: "Level UPDS",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <body className={`${roboto.variable} ${robotoFlex.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <div id="clerk-captcha" />
      </body>
    </html>
  )
}
