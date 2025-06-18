import React from 'react';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { ButtonProps as MuiButtonProps } from '@mui/material'; // Keep for potential sx type reference if needed
// Remove theme context import and constants, rely on MUI theme

/**
 * Props for the Button component.
 * Extends MUI's LoadingButtonProps for better integration.
 */
interface ButtonProps extends Omit<LoadingButtonProps, 'variant' | 'color' | 'size'> {
  children: React.ReactNode;
  /** Button variant: contained, outlined, or text */
  variant?: 'contained' | 'outlined' | 'text';
  /** Button color based on theme palette */
  color?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | 'inherit';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** If true, the button will take up the full width of its container. */
  fullWidth?: boolean;
  /** Function called when the button is clicked. */
  onClick?: () => void;
  /** Element placed before the children. */
  startIcon?: React.ReactNode;
  /** Element placed after the children. */
  endIcon?: React.ReactNode;
  /** If true, the button is disabled. */
  disabled?: boolean;
  /** If true, display a loading indicator. */
  loading?: boolean;
  /** The type of the button. */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS class names. */
  className?: string;
}

/**
 * A customizable Button atom component built on MUI's LoadingButton.
 *
 * Provides standard button functionality with variants, colors, sizes,
 * and integrates loading state display.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary', // Default to primary color
  size = 'medium',
  children,
  fullWidth = false,
  onClick,
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  sx, // Include sx prop
  ...rest // Pass rest of the props to LoadingButton
}) => {
  // Remove custom color logic based on isDarkMode
  // Remove variant mapping (use directly)
  // Remove size mapping (use directly)

  return (
    <LoadingButton
      variant={variant}
      color={color} // Pass color directly
      size={size} // Pass size directly
      className={className}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      loading={loading} // Pass loading prop
      type={type}
      sx={{
        // Keep custom styles
        borderRadius: '6px',
        textTransform: 'none',
        // Adjust shadow based on variant
        boxShadow: variant !== 'text' ? (loading || disabled ? 0 : 2) : 0,
        // Hover/Active effects might need adjustment with LoadingButton
        '&:hover': {
          transform: loading || disabled ? 'none' : 'translateY(-1px)',
          boxShadow: variant !== 'text' ? (loading || disabled ? 1 : 3) : 0,
          // Let MUI handle hover background color based on theme and variant/color
        },
        '&:active': {
          transform: loading || disabled ? 'none' : 'translateY(0px)',
        },
        // Merge incoming sx prop
        ...sx,
      }}
      {...rest} // Spread any other props
    >
      {children}
    </LoadingButton>
  );
};

export default Button; 