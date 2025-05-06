import NavBarPublic from "@/app/components/NavBarPublic";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <>
      <main className="bg-primary-4 overflow-auto">
        <NavBarPublic/>
        {children}
      </main>
    </>
  );
}