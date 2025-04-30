import NavBarPublic from "../components/NavBarPublic";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <>
      <NavBarPublic/>

      <main className="bg-primary-4 overflow-auto">
        {children}
      </main>
    </>
  );
}