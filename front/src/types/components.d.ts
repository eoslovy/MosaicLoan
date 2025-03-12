export type ButtonType = "filled" | "outline";
export type TextColor = "white" | "gray" | "light_blue" | "blue" | "black";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface TextProps {
  text: string;
  size?: TextSize;
  color?: TextColor;
}

export interface ButtonProps {
  label: TextProps;
  variant?: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
}
