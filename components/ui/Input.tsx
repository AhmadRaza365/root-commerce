import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

type Props = {
  label: string | React.ReactNode;
  name: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  maxLength?: number;
  value: string;
  setValue: (value: string) => void;
  hasError: boolean;
  setHasError: (value: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  showHelpText?: boolean;
  helpText?: string | React.ReactNode;
  isPassword?: boolean;
};

function Input({
  name,
  label,
  type,
  autoComplete,
  placeholder,
  maxLength = 200,
  value,
  setValue,
  hasError,
  setHasError,
  required = false,
  disabled = false,
  showHelpText = false,
  helpText = '',
  isPassword = false,
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <label htmlFor={name} className="label flex-col items-start text-base-content w-full">
      {label}
      <div className="w-full relative flex items-center">
        <input
          id={name}
          name={name}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          className={`input w-full focus:input-accent input-sm lg:input-md border autofill:bg-base-100 autofill:shadow-none ${hasError ? 'input-error border-error' : 'input-accent border-base-content '}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setHasError(false);
          }}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2 btn btn-square btn-ghost btn-sm z-[1]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
          </button>
        )}
      </div>
      {showHelpText && (
        <span className={`w-full text-sm ${hasError ? 'text-error' : 'text-base-content'}`}>
          {helpText}
        </span>
      )}
    </label>
  );
}

export default Input;
