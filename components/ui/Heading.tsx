import React from 'react';
import clsx from 'clsx';

type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadingProps = {
  color?: string;
  variant?: HeadingVariant;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<HeadingVariant, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  h3: 'text-2xl font-medium',
  h4: 'text-xl font-medium',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
};

const Heading: React.FC<HeadingProps> = ({
  color = 'text-base-content',
  variant = 'h2',
  className = '',
  children,
}) => {
  const Component = variant as React.ElementType;
  return (
    <Component className={clsx(variantClasses[variant], color, className)}>{children}</Component>
  );
};

export default Heading;
