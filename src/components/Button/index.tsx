import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import * as Feather from "react-icons/fi/";
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  children?: React.ReactNode;
}

interface IconProps {
  iconName: any
  size: number  
}

function Icon ({iconName, ...props}: IconProps) {
  const getIcon = (iconName: string) => {
    const iconsMap = new Map();
    iconsMap.set("Fi", Feather)
    return iconsMap.get(iconName)
  }
  const icons: any = getIcon(iconName.substring(0, 2))
  if (icons[iconName]) {
    const TheIcon: IconType = icons[iconName]
    return <TheIcon  {...props} />
  }
  return <span>Invalid</span>
}

export default function Button({icon, children, ...props}: ButtonProps) {
  return (
    <button {...props} className={styles.button}>
      {children}
      {icon && (
        <div className={`${styles.iconBox} ${children ? styles.MLSm: ''}`}>
          <Icon iconName={icon} size={24} />
        </div>
      )}
    </button>
  )
}