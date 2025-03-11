// 버튼 컴포넌트
export type ButtonProps = {
  label: string; //버튼에 표시될 text -> 필수로 하자
  onClick?: () => void;
  variant?: "filled" | "outline";
  size?: "small" | "medium" | "large";
  icon?: string;
  disabled?: boolean;
};
