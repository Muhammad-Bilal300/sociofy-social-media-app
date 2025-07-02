import React from "react";

interface TextButtonProps {
  buttonText: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  fontWeight?: string;
  fontSize?: string;
  disabled?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({
  buttonText,
  onClick,
  color = "",
  fontWeight = "",
  fontSize = "",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`cursor-pointer bg-transparent p-0 m-0 flex justify-start ${color} ${fontWeight} ${fontSize}`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export default TextButton;
