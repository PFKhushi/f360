export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      ACESSO PRIVADO
      {children}
    </main>  
  );
}