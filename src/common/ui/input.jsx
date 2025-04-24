import React, {forwardRef} from 'react';
import {cn} from '../../utils/utils';

const Input = forwardRef(({className, type, ...props}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground',
        'focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:shadow-md',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export {Input};
