"use client";
import { registerUser } from "@/actions";
import { CustomButton, CustomInput } from "@/components/common";
import { RegExp } from "@/infrastructure";
import {
  GetUserInvitationResponse,
  RegisterUserRequest,
  userRoleLabels,
} from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

type RegisterForm = {
  name: string;
  lastname: string;
  password: string;
  confirmPassword: string;
};

const initialFormData: RegisterForm = {
  name: "",
  lastname: "",
  password: "",
  confirmPassword: "",
};

interface Props {
  invitation: GetUserInvitationResponse;
}

export const RegisterForm = ({ invitation }: Props) => {
  const [form, setForm] = useState<RegisterForm>(initialFormData);
  const [error, setError] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const router = useRouter();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (isRegistered) {
      if (counter === 0) {
        router.push("/auth/login");
        return;
      }

      const timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [counter, router, isRegistered]);

  const handleName = (value: string) => {
    setForm((prev) => ({ ...prev, name: value }));
  };

  const handleLastname = (value: string) => {
    setForm((prev) => ({ ...prev, lastname: value }));
  };

  const handlePassword = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }));
  };

  const handleConfirmPassword = (value: string) => {
    setForm((prev) => ({ ...prev, confirmPassword: value }));
  };

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name) return setError("Debe ingresar su nombre.");
    if (form.name.length < 3)
      return setError("Su nombre debe ser mayor a 3 caracteres.");
    if (!form.lastname) return setError("Debe ingresar su apellido.");
    if (form.lastname.length < 3)
      return setError("Su apellido debe ser mayor a 3 caracteres.");
    if (!RegExp.password.test(form.password))
      return setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      );
    if (form.password !== form.confirmPassword)
      return setError("Las contraseñas deben coincidir.");

    const data: RegisterUserRequest = {
      name: form.name,
      lastname: form.lastname,
      password: form.password,
      invitationId: invitation.id,
    };

    const response = await registerUser(data);

    if (!response.success) return setError(response.error!);

    setIsRegistered(true);
  };

  return (
    <>
      {isRegistered ? (
        <div className="p-5 w-full h-full">
          <div className="flex flex-col justify-center items-center gap-3 w-full h-auto">
            <FaRegCircleCheck className="text-green-600 text-8xl" />
            <h2 className="text-gray-900 text-center mt-3">
              Su cuenta ha sido creada correctamente, serás redirigido al inicio
              de sesión en <span className="font-bold">{counter}</span>{" "}
              segundos.
            </h2>
          </div>
        </div>
      ) : (
        <form className="p-5 w-full h-full" onSubmit={handleRegister}>
          <div className="flex flex-col gap-3 w-full h-auto">
            <div className="flex flex-col text-black">
              <h2 className="text-3xl pb-3">Bienvenido!</h2>
              <p>
                Su invitación ha sido validada correctamente. Puede registrarse
                en el sistema utilizando el correo electrónico{" "}
                <span className="font-bold">{invitation.toEmail}</span> con el
                rol de{" "}
                <span className="font-bold">
                  {userRoleLabels[invitation.role]}
                </span>
                .
              </p>
              <h2 className="text-xl pt-3">
                Ingrese la siguiente información:
              </h2>
            </div>
            <CustomInput
              id={"nombre"}
              type={"text"}
              label={"Nombre/s"}
              placeholder={"Ingrese su nombre"}
              value={form.name}
              setValue={handleName}
              required
            />
            <CustomInput
              id={"apellido"}
              type={"text"}
              label={"Apellido/s"}
              placeholder={"Ingrese su apellido"}
              value={form.lastname}
              setValue={handleLastname}
              required
            />
            <CustomInput
              id={"password"}
              type={"password"}
              label={"Contraseña"}
              placeholder={"Ingrese su contraseña"}
              value={form.password}
              setValue={handlePassword}
              required
            />
            <p className="text-xs text-gray-500 pl-2">
              * Mínimo 8 caracteres, una mayúscula, una minúscula, un número y
              un carácter especial.
            </p>
            <CustomInput
              id={"confirm-password"}
              type={"password"}
              label={"Confirmar contraseña"}
              placeholder={"Ingrese nuevamente su contraseña"}
              value={form.confirmPassword}
              setValue={handleConfirmPassword}
              required
            />
            <CustomButton label="Registrarme" />
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </form>
      )}
    </>
  );
};
