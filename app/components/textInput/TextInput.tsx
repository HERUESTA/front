import React from "react";

type TextInputProps = {
  placeholder: string;
};

const TextInput: React.FC<TextInputProps> = ({ placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="input input-bordered w-full max-w-xs"
    />
  );
};

export default TextInput;
