import React from "react";
import styles from "@/styles/components/Text.module.scss";
import { TextProps } from "@/types/components";

const Text: React.FC<TextProps> = ({ text, size = "medium", color = "blue" }) => {
  return <span className={`${styles.text} ${styles[size]} ${styles[color]}`}>{text}</span>;
};

export default Text;
