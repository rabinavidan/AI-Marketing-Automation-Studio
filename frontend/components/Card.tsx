import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  'data-testid'?: string;
}

export default function Card({ children, className = '', title, ...rest }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 ${className}`}
      {...rest}
    >
      {title && <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>}
      {children}
    </div>
  );
}
