"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
  id: string;
  type: "email" | "text" | "password" | "date";
  label: string;
  placeholder: string;
  value: any;
  setValue: Dispatch<SetStateAction<string>> | ((value: string) => void);
  required?: boolean;
}

export const CustomInput = ({
  id,
  type,
  label,
  placeholder,
  value,
  setValue,
  required = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-pgray pl-2 pb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          id={id}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full h-11 px-4 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-500 ${
            isPassword ? "pr-11" : ""
          }`}
          placeholder={placeholder}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};
