import React from "react";
import { ElementType } from "react";

interface OutlineButtonProps {
  isIcon?: boolean;
  icon?: ElementType;
  isIconLeft?: boolean;
  isIconRight?: boolean;
  borderColor?: string;
  borderWidth?: string;
  rounded?: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
  height?: string;
  width?: string;
  fontWeight?: string;
  fontSize?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  px?: string;
  hover?: string;
  disabled?: boolean;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  borderColor = "",
  borderWidth = "",
  rounded = "",
  bgColor = "",
  textColor = "",
  buttonText = "",
  height = "",
  width = "",
  fontWeight = "",
  fontSize = "",
  type = "button",
  onClick,
  px = "",
  hover = "",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`cursor-pointer ${bgColor} ${textColor} ${height} ${width} ${fontWeight} ${fontSize} ${borderColor} ${borderWidth} ${rounded} ${px} ${hover} text-center flex justify-center items-center`}
      type={type}
      onClick={onClick}
    >
      {isIconLeft && isIcon && (
        <span className={`${buttonText !== "" ? "mr-3" : "mr-0"}`}>
          {Icon ? <Icon className={`${fontSize}`} /> : null}
        </span>
      )}
      {buttonText !== "" && <span>{buttonText}</span>}
      {isIconRight && isIcon && (
        <span className={`${buttonText !== "" ? "ml-3" : "ml-0"}`}>
          {Icon ? <Icon className={`${fontSize}`} /> : null}
        </span>
      )}
    </button>
  );
};

export default OutlineButton;
