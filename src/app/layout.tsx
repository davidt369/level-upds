import type { Metadata } from "next";
import {
  Roboto,
  Roboto_Flex,
  Roboto_Mono,
  Roboto_Serif,
  Roboto_Condensed
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

// Roboto estándar
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

// Roboto Flex (más opciones de personalización)
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});

export const metadata: Metadata = {
  title: "Level UPDS",
  description: "Plataforma de aprendizaje",
  icons: {
    icon: [
      {
        url: "/upds-logo.png",
        type: "image/png",
      },
      {
        url: "/upds-logo.png",
        type: "image/png",
        sizes: "180x180",
        rel: "apple-touch-icon",
      },
    ],
    shortcut: "/upds-logo.png",
    apple: "/upds-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${robotoFlex.variable} font-sans antialiased`}
      >
        <Providers>

          {children}

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}