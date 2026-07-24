import type { Metadata } from "next"
import { Inter, Playfair_Display, Raleway, Montserrat, Roboto, Oswald, Poppins, Lora, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" })
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "600", "700", "800"] })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" })
const bebas = Bebas_Neue({ subsets: ["latin"], variable: "--font-bebas", weight: "400" })

export const metadata: Metadata = {
  title: "Ativador Automático de Produtos Virais",
  description: "Transforme sua ideia em um produto digital completo, pronto para vender — em minutos.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`h-full ${inter.variable} ${playfair.variable} ${raleway.variable} ${montserrat.variable} ${roboto.variable} ${oswald.variable} ${poppins.variable} ${lora.variable} ${bebas.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
