export type ButtonType = "filled" | "outlined" | "non-selected";
export type ButtonSize = "normal" | "large";
export type TextColor = "white" | "gray" | "light-blue" | "blue" | "black" | "text-ascendRed" | "text-descentBlue";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface TextProps {
  text: string;
  size?: TextSize;
  color?: TextColor;
}

export interface ButtonProps {
  label: TextProps;
  variant: ButtonType;
  size: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
}

interface StatCardProps {
  icon: "users" | "trendingUp" | "clock"; 
  value: string;
  label: string;
}

interface ServiceInfoCardProps {
  icon: "shield" | "users" | "trendingUp" | "clock";
  value: string;
  label: string;
}

interface BasicInfoCardProps {
  icon: "creditCard" | "trendingUp" | "clock" | "arrowUpRight";
  value: string;
  label: string;
}

interface UserInfoCardProps {
  icon: "clock" | "triangleAlert";
  title: TextProps;
  category: TextProps;
  categoryValue: TextProps;
  totalCount: TextProps;
  changeRate: TextProps;
}

