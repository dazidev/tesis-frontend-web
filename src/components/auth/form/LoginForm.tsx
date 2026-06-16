"use client";
import { authenticate } from "@/actions";
import { CustomButton, CustomInput } from "@/components/common";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let deviceId = localStorage.getItem("deviceId");
    const userAgent = navigator.userAgent;

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }

    const data = {
      email,
      password,
      deviceId,
      deviceInfo: userAgent,
    };

    const result = await authenticate(data);

    if (!result?.ok) {
      setErrorMessage(result?.message!);
    }

    setIsLoading(false);
  };

  return (
    <form className="p-5 w-full h-full" onSubmit={handleLogin}>
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
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
    </form>
  );
};
