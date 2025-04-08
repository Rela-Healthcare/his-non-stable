import React from 'react';
import {motion} from 'framer-motion';

// Custom Accordion Item Component
export const CustomAccordionItem = ({
  title,
  children,
  index,
  activeIndex,
  onToggle,
}) => {
  const isOpen = activeIndex === index;

  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full text-left px-4 py-3 font-semibold text-lg bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none flex justify-between items-center">
        {title}
        <motion.span
          animate={{rotate: isOpen ? 180 : 0}}
          transition={{duration: 0.3}}
          className="transform">
          ▼
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{duration: 0.3, ease: 'easeInOut'}}
        className="overflow-hidden">
        <fieldset disabled={!isOpen}>
          <div className="px-4 py-3">{children}</div>
        </fieldset>
      </motion.div>
    </div>
  );
};

// Custom Accordion Wrapper Component
export const CustomAccordion = ({children, activeIndex, setActiveIndex}) => {
  const onToggle = (index) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  };

  const renderedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      index,
      activeIndex,
      onToggle,
    })
  );

  return <div className="space-y-4">{renderedChildren}</div>;
};
