import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-electric-purple hover:bg-electric-purple/90 text-white shadow-lg shadow-electric-purple/20',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100',
      outline: 'border border-white/10 hover:bg-white/5 text-slate-100',
      ghost: 'hover:bg-white/5 text-slate-400 hover:text-slate-100',
      neon: 'bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue/10 shadow-[0_0_10px_rgba(0,245,255,0.2)] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-blue disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Card = ({ className, children, glow = false }: { className?: string; children: React.ReactNode; glow?: boolean }) => (
  <div className={cn('glass-card p-6', glow && 'neon-border', className)}>
    {children}
  </div>
);

interface BadgeProps {
  variant?: 'blue' | 'purple' | 'green' | 'red';
  children: React.ReactNode;
  className?: string;
  key?: any;
}

export const Badge = ({ children, className, variant = 'blue' }: BadgeProps) => {
  const variants = {
    blue: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    purple: 'bg-electric-purple/10 text-electric-purple border-electric-purple/20',
    green: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    red: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', variants[variant], className)}>
      {children}
    </span>
  );
};
