import React, {useState} from 'react';
import {motion} from 'framer-motion';

// Custom Accordion Item Component
const CustomAccordionItem = ({
  title,
  children,
  index,
  activeIndex,
  onToggle,
}) => {
  const isOpen = activeIndex === index; // Check if the current item is open

  return (
    <div className="border-b">
      <button
        onClick={() => onToggle(index)}
        className="w-full text-left px-4 py-3 font-semibold text-lg bg-gray-200 border rounded-md hover:bg-gray-300 focus:outline-none flex justify-between items-center">
        <span>{title}</span>
        <motion.span
          animate={{rotate: isOpen ? 180 : 0}}
          transition={{duration: 0.3}}
          className="transform">
          ▼ {/* The down arrow icon */}
        </motion.span>
      </button>

      <motion.div
        initial={{height: 0, opacity: 0}}
        animate={{height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0}}
        transition={{duration: 0.3, ease: 'easeInOut'}}
        className="overflow-hidden">
        <div className="px-4 py-3 text-gray-700">{children}</div>
      </motion.div>
    </div>
  );
};

// Custom Accordion Component
const CustomAccordion = ({children}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle open/close
  };

  return (
    <div className="space-y-4">
      {children({activeIndex, onToggle: toggleAccordion})}
    </div>
  );
};

export {CustomAccordion, CustomAccordionItem};
