import React from "react";
import { IoHome } from "react-icons/io5";
import { LuBook, LuUserPen, LuUsers } from "react-icons/lu";

const iconMap = {
  IoHome,
  LuBook,
  LuUsers,
  LuUserPen,
};

export function getIcon(iconName: string, size: number = 12): React.ReactNode {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent size={size} /> : null;
}
