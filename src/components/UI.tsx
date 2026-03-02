import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon' | 'cyan' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-dark-surface hover:bg-dark-surface/80 text-text-primary border border-white/10 shadow-lg',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100',
      outline: 'border border-white/10 hover:bg-white/5 text-slate-100',
      ghost: 'hover:bg-white/5 text-text-secondary hover:text-text-primary',
      neon: 'bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,245,255,0.2)] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]',
      cyan: 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]',
      purple: 'bg-electric-purple/10 text-electric-purple border border-electric-purple/30 hover:bg-electric-purple/20 hover:border-electric-purple hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]',
      green: 'bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 hover:border-neon-green hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2',
    };

    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        ref={ref as any}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props as any}
      />
    );
  }
);
Button.displayName = 'Button';

export const Card = ({ className, children, glow = false, variant = 'cyan' }: { className?: string; children: React.ReactNode; glow?: boolean; variant?: 'cyan' | 'purple' | 'green' }) => {
  const glowClasses = {
    cyan: 'neon-border-cyan',
    purple: 'neon-border-purple',
    green: 'neon-border-green',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={cn(
        'glass-panel p-6 transition-all duration-300', 
        glow && glowClasses[variant], 
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface BadgeProps {
  variant?: 'cyan' | 'purple' | 'green' | 'red' | 'blue';
  children: React.ReactNode;
  className?: string;
  key?: any;
}

export const Badge = ({ children, className, variant = 'cyan' }: BadgeProps) => {
  const variants = {
    cyan: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 shadow-[0_0_10px_rgba(0,245,255,0.1)]',
    purple: 'bg-electric-purple/10 text-electric-purple border-electric-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]',
    green: 'bg-neon-green/10 text-neon-green border-neon-green/30 shadow-[0_0_10px_rgba(57,255,20,0.1)]',
    red: 'bg-soft-red/10 text-soft-red border-soft-red/30 shadow-[0_0_10px_rgba(255,77,77,0.1)]',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm transition-all duration-300', variants[variant], className)}>
      {children}
    </span>
  );
};
