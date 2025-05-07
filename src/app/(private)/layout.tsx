'use client'

import Sidebar from "../components/sidebar/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-svh w-full"> 
      <Sidebar/>
      <div className="flex flex-col w-full max-h-svh grow">
        {children}
      </div>
    </main>  
  );
}