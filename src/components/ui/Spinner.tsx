import React from 'react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md', className = '', ...props }: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`inline-block ${sizeClasses[size]} border-3 border-current border-t-transparent rounded-full animate-spin ${className}`}
      {...props}
    />
  );
}
