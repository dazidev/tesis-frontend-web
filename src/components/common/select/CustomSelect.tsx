import { Dispatch, SetStateAction } from "react";

type SelectOption = {
  label: string;
  value: string;
};

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  allowEmptyOption?: boolean;
}

export const CustomSelect = ({
  id,
  label,
  placeholder = "Selecciona una opción",
  value,
  setValue,
  options,
  required = false,
  allowEmptyOption = false,
}: Props) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-pgray pl-2 pb-1">
        {label}
      </label>

      <select
        id={id}
        required={required}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-11 px-4 text-gray-900 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
      >
        <option value="" disabled={!allowEmptyOption}>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
