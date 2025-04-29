import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Fábrica de Software - UNIPÊ",
  description: "Este é o site da Fábrica de Software do UNIPÊ",
  icons: '/images/logos/roxa/LOGO-ROXA.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="font-roboto"
      >
        {children}
        <ToastContainer/>
      </body>
    </html>
  );
}
