import React from 'react';
import '../../styles/theme.css';

export interface InputProps {
  label?: string;
  id?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = '',
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onKeyDown,
  disabled = false,
  error,
  size = 'md',
}) => {
  // Automatically generate id if not provided, for label association
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg'
  };

  const baseClasses = `
    w-full
    ${sizeClasses[size]}
    bg-[var(--color-surfaceBackground)]
    text-[var(--color-textPrimary)]
    border
    border-[var(--color-borderColor)]
    rounded-md
    shadow-sm
    transition-all
    duration-200
    placeholder:text-[var(--color-textSecondary)]
    placeholder:opacity-70
    focus:outline-none
    focus:ring-2
    focus:ring-[var(--color-primary)]
    focus:border-[var(--color-primary)]
  `;

  const disabledClasses = disabled 
    ? `
      opacity-60
      cursor-not-allowed
      bg-[var(--color-disabledBackground)]
      text-[var(--color-disabledText)]
      border-[var(--color-disabledBackground)]
    ` 
    : '';

  const errorClasses = error 
    ? `
      border-[var(--color-danger)]
      focus:ring-[var(--color-danger)]
      focus:border-[var(--color-danger)]
    ` 
    : '';

  const containerClass = label ? 'mb-4' : '';

  return (
    <div className={containerClass}>
      {label && (
        <label 
          className={`
            block
            font-medium
            mb-2
            text-[var(--color-textPrimary)]
            ${disabled ? 'text-[var(--color-disabledText)]' : ''}
          `}
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className={`${baseClasses} ${disabledClasses} ${errorClasses} ${className}`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
}; 