import Header from "@/app/components/header/Header";

export default function RootLayout({ children }: { children: React.ReactNode}){

  const menuTree = [
    {
      id: '01',
      title: 'Imersões',
      href: '/imersoes',
    },
    {
      id: '02',
      title: 'Eventos',
      href: '/imersoes/eventos',
    }
  ]

  return (
    <> 
      <Header navigation={{menuTitle: 'Imersões', menuTree: menuTree}}/>
      {children}
    </>
  );
}