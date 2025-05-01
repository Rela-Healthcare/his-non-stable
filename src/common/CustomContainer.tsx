import React from 'react';
import {cn} from '../utils/utils';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface CustomContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
  centered?: boolean;
  as?: keyof JSX.IntrinsicElements;
  paddingX?: string;
  fadeIn?: boolean;
  scrollable?: boolean;
  scrollMaxHeight?: string;
}

const widthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

const CustomContainer: React.FC<CustomContainerProps> = ({
  children,
  className = '',
  maxWidth = '2xl',
  centered = false,
  as: Component = 'div',
  paddingX = 'px-4',
  fadeIn = false,
  scrollable = false,
  scrollMaxHeight = 'max-h-[80vh]',
}) => {
  const OuterComponent = scrollable ? 'div' : React.Fragment;

  return (
    <OuterComponent
      {...(scrollable && {
        className: cn(
          'w-full h-full overflow-y-auto',
          'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-400',
          scrollMaxHeight
        ),
      })}>
      <Component
        className={cn(
          'w-full',
          widthClasses[maxWidth],
          centered && 'mx-auto',
          paddingX,
          fadeIn && 'animate-fade-in',
          className
        )}>
        {children}
      </Component>
    </OuterComponent>
  );
};

export default CustomContainer;
