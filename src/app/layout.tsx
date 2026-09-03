import type { Metadata } from 'next'
import './globals.css'
import './sanvit-holding.css'

export const metadata: Metadata = {
  title: 'Санвіт-Холдинг — повний цикл пакування для бізнесу',
  description:
    'Група компаній із 25-річним досвідом: гофроупаковка, гофротара, гнучка упаковка, скотч, стрейч-плівка та крафт-папір. Комплексне рішення для бізнесу.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="sanvit-holding">{children}</body>
    </html>
  )
}
