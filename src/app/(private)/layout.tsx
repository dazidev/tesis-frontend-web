import { redirect } from "next/navigation";
import { auth } from "@/infrastructure/lib/auth";
import { AuthProvider, SessionGuard } from "@/components/auth";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }
  return (
    <AuthProvider session={session}>
      <SessionGuard />
      {children}
    </AuthProvider>
  );
}
