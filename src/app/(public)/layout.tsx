import Link from "next/link";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <nav className="p-2 w-full max-w-400 mx-auto">
        <ul className="flex justify-between">
          <div className="flex gap-2 *:hover:text-secondary-1">
            <li>
              <Link href={'/'}>Home</Link>
            </li>
            <li>
              <Link href={'/estrutura-e-equipes'}>Estrutura e Equipes</Link>
            </li>
            <li>
              <Link href={'/projetos'}>Projetos</Link>
            </li>
            <li>
              <Link href={'/como-participar'}>Como Participar</Link>
            </li>
            <li>
              <Link href={'/sobre'}>Sobre nós</Link>
            </li>
          </div>

          <div className="flex gap-2 *:hover:text-secondary-1">
            <li>
              <Link href={'/register'}>Cadastrar</Link>
            </li>
            <li>
              <Link href={'/sign-in'}>Sign-In</Link>
            </li>
          </div>
        </ul>
      </nav>
      {children}
    </main>  
  );
}