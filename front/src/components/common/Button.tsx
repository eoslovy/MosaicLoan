import React from "react";
import styles from "@/styles/components/Button.module.scss";
import { ButtonProps } from "@/types/components";
import Text from "@/components/common/Text";

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "filled",
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        disabled ? styles.disabled : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      style={{ fontSize: label.size ? `var(--text-${label.size})` : "inherit" }} // 버튼 크기를 텍스트 크기에 맞춤
    >
      <Text {...label} />
    </button>
  );
};

export default Button;
