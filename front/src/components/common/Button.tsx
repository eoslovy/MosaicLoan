import React from "react";
import styles from "@/styles/components/Button.module.scss";
import { ButtonProps } from "@/types/components";
import Text from "@/components/common/Text";

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "filled",
  size = "normal",
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${
        disabled ? styles.disabled : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      style={{ fontSize: label.size ? `var(--text-${label.size})` : "inherit" }}
    >
      <Text {...label} color={label.color || "white"} />
    </button>
  );
};

export default Button;
