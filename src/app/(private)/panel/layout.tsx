import { AsideNav } from "@/components/private";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white">
      <AsideNav />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 w-full shrink-0 border-b border-b-pborder">
          <h1>ruta</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
