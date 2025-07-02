import React from "react";
import { ElementType } from "react";

interface FilledButtonProps {
  isIcon?: boolean;
  icon?: ElementType;
  isIconLeft?: boolean;
  isIconRight?: boolean;
  iconSize?: string;
  bgColor?: string;
  textColor?: string;
  rounded?: string;
  buttonText?: string;
  height?: string;
  width?: string;
  fontWeight?: string;
  fontSize?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  px?: string;
  disabled?: boolean;
}

const FilledButton: React.FC<FilledButtonProps> = ({
  isIcon,
  icon: Icon,
  isIconLeft,
  isIconRight,
  iconSize = "",
  bgColor = "",
  textColor = "",
  rounded = "",
  buttonText = "",
  height = "",
  width = "",
  fontWeight = "",
  fontSize = "",
  type = "button",
  onClick,
  px = "",
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={`cursor-pointer ${bgColor} ${textColor} ${height} ${width} ${fontWeight} ${fontSize} text-center ${rounded} ${px} ${
        disabled ? "opacity-60" : ""
      } flex justify-center items-center`}
      type={type}
      onClick={onClick}
    >
      {isIconLeft && isIcon && (
        <span className={`${buttonText !== "" ? "mr-3" : "mr-0"}`}>
          {Icon ? <Icon className={iconSize} /> : null}
        </span>
      )}
      {buttonText !== "" && <span>{buttonText}</span>}
      {isIconRight && isIcon && (
        <span className={`${buttonText !== "" ? "mr-3" : "mr-0"}`}>
          {Icon ? <Icon className={iconSize} /> : null}
        </span>
      )}
    </button>
  );
};

export default FilledButton;
