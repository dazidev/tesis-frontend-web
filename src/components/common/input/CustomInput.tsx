import { Dispatch, SetStateAction } from "react";

interface Props {
  id: string;
  type: "email" | "text" | "password";
  label: string;
  placeholder: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
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
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-pgray pl-2 pb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-11 px-4 text-sgray border border-gray-300 rounded-lg outline-none focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
};
