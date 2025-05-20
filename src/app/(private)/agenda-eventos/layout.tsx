import Header from "@/app/components/header/Header";

export default function RootLayout({ children }: { children: React.ReactNode}){

  return (
    <> 
      <Header navigation={{menuTitle: 'Agenda de Eventos', menuTree: []}}/>
      {children}
    </>
  );
}