import React from "react";

interface IconButtonProps {
  icon: React.ElementType;
  size: string;
  color: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  size,
  color,
  onClick,
}) => {
  return (
    <button className="cursor-pointer bg-transparent p-0 text-transparent">
      <Icon onClick={onClick} className={`${size} ${color} text-center`} />
    </button>
  );
};

export default IconButton;
