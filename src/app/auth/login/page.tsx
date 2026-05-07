"use server";
import { LoginForm } from "@/components/auth";

export default async function LoginPage() {
  return (
    <div className="flex justify-center items-center w-full h-screen max-h-screen bg-pwhite overflow-hidden">
      <div className="flex w-[450px] h-auto bg-white border border-pborder rounded-2xl shadow-lg shadow-gray-400/20">
        <LoginForm />
      </div>
    </div>
  );
}
