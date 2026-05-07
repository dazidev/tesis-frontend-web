"use client";
import { CustomButton, CustomInput } from "@/components/common";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
  };

  return (
    <form className="p-5 w-full h-full" onSubmit={(e) => handleLogin(e)}>
      <div className="flex flex-col gap-3 w-full h-auto">
        <CustomInput
          id={"email"}
          type={"email"}
          label={"Correo Electrónico"}
          required={true}
          placeholder={"Ingrese su correo electrónico"}
          value={email}
          setValue={setEmail}
        />
        <CustomInput
          id={"password"}
          type={"password"}
          label={"Contraseña"}
          required={true}
          placeholder={"Ingrese su contraseña"}
          value={password}
          setValue={setPassword}
        />
        <CustomButton label="Iniciar Sesión" />
      </div>
    </form>
  );
};
