import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  register: UseFormRegister<any>; // You can replace `any` with a specific form schema type
  name: string;
  placeholder: string;
  type: string;
  errors?: FieldErrors;
  validationRules?: Record<string, any>;
  width?: string;
  marginBottom?: string;
  icon?: React.ElementType; // Icon component
  isVisible?: boolean;
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[] | undefined | null;
  preIcon?: React.ElementType; // Icon component
}

const InputField: React.FC<InputFieldProps> = ({
  register,
  name,
  placeholder,
  type,
  errors = {},
  validationRules = {},
  width = "",
  marginBottom = "",
  icon: Icon,
  isVisible = false,
  setIsVisible,
  disabled = false,
  onChange = () => {},
  value = undefined,
  preIcon: PreIcon,
}) => {
  const toggleVisibility = () => {
    setIsVisible?.(!isVisible);
  };

  return (
    <div className={marginBottom}>
      <div
        className={`h-[38px] border-[1px] border-secondary rounded-md ${width} px-2 flex items-center ${
          disabled ? "bg-[#f2f2f2]" : "bg-transparent"
        }`}
      >
        {PreIcon && (
          <span className="cursor-pointer flex items-center mr-3">
            <PreIcon className="text-lg text-secondary" />
          </span>
        )}
        <input
          disabled={disabled}
          className="outline-none border-none w-full bg-transparent"
          type={isVisible ? "text" : type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          onChange={onChange}
          value={value ?? undefined}
        />
        {type === "password" && Icon ? (
          <span onClick={toggleVisibility} className="cursor-pointer">
            <Icon className="text-xl text-primary" />
          </span>
        ) : (
          Icon && (
            <span onClick={toggleVisibility} className="cursor-pointer">
              <Icon className="text-xl text-primary" />
            </span>
          )
        )}
      </div>

      {errors?.[name] && (
        <span className="text-red-500 text-sm">
          {(errors[name] as any)?.message}
        </span>
      )}
    </div>
  );
};

export default InputField;
