import Header from "@/app/components/header/Header";

export default function RootLayout({ children }: { children: React.ReactNode}){

  return (
    <> 
      <Header navigation={{menuTitle: 'Projetos de Extensão', menuTree: []}}/>
      {children}
    </>
  );
}