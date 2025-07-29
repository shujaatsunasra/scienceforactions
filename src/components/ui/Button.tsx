"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-accent hover:from-primaryDark hover:to-primary text-white shadow-button hover:shadow-button-hover focus:ring-primary/30",
      secondary: "bg-card hover:bg-surface text-text border border-cardBorder shadow-smooth hover:shadow-card focus:ring-primary/20",
      outline: "border border-cardBorder text-text hover:bg-surface focus:ring-primary/20",
      ghost: "text-text hover:bg-surface focus:ring-primary/20",
      destructive: "bg-error hover:bg-error/90 text-white shadow-button focus:ring-error/30"
    };

    const sizes = {
      sm: "px-3 py-2 text-sm rounded-lg gap-2",
      md: "px-4 py-3 text-base rounded-xl gap-2",
      lg: "px-6 py-4 text-lg rounded-xl gap-3",
      xl: "px-8 py-5 text-xl rounded-2xl gap-3"
    };

    const pillSizes = {
      sm: "rounded-pill",
      md: "rounded-pill", 
      lg: "rounded-pill",
      xl: "rounded-pill"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          variant === 'primary' ? pillSizes[size] : sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full opacity-60"
            />
          </motion.div>
        )}
        
        <div className={cn(
          "flex items-center gap-2",
          loading && "opacity-0"
        )}>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
