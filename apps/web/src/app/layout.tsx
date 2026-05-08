import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: '♟️ c4c-chess — Шахматы на блокчейне',
  description: 'Играй в шахматы на токены C4C. Создавай игры, приглашай друзей, выигрывай!',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
