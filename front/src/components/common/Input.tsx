import React from 'react';
import styles from '@/styles/components/Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  className?: string;
}

const Input = ({ prefix = '', className = '', ...props }: InputProps) => {
  return (
    <div className={styles.inputWrapper}>
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <input className={`${styles.input} ${className}`} {...props} />
    </div>
  );
};

Input.defaultProps = {
  prefix: '',
  className: '',
};

export default Input;
