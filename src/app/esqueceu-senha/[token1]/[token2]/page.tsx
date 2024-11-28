'use client'
import RecuperarSenha from '@/components/recuperar-senha/RecuperarSenha'
import { useParams } from 'next/navigation'

export default function EsqueceuSenha() {
  const { token1, token2 } = useParams()

  if (!token1 || !token2) {
    return (
      <main className="min-h-screen bg-dark-purple text-white flex items-center justify-center">
        <p>
          Tokens inválidos. Por favor, verifique o link de recuperação de senha.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark-purple text-white">
      <RecuperarSenha url={`${token1}/${token2}`} />
    </main>
  )
}
