import React, { ChangeEvent } from "react";

type TextInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      className="input input-bordered w-full max-w-xs"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Enter text"}
    />
  );
};

export default TextInput;
