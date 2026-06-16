"use server";
import { getUserInvitation } from "@/actions";
import { RegisterForm } from "@/components/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/auth/login");
  }

  const invitation = await getUserInvitation(token);

  if (!invitation.success || !invitation.data) {
    redirect("/auth/login");
  }

  return (
    <div className="flex justify-center items-center w-full h-screen max-h-screen bg-pwhite overflow-hidden">
      <div className="flex w-[450px] h-auto bg-white border border-pborder rounded-2xl shadow-lg shadow-gray-400/20">
        <RegisterForm invitation={invitation.data} />
      </div>
    </div>
  );
}
