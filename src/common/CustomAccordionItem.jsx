import React from 'react';
import {motion} from 'framer-motion';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';

// Custom Accordion Item Component
export const CustomAccordionItem = ({
  title,
  children,
  index,
  activeAccordions = [],
  setActiveAccordions,
  isCompleted,
}) => {
  const isOpen = activeAccordions.includes(index);

  const onToggle = (index) => {
    setActiveAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full text-left px-4 py-3 font-semibold text-lg bg-[#3c4b64] text-white rounded-md hover:bg-[#3c4b64] focus:outline-none flex justify-between items-center">
        {title}
        {isCompleted && !isOpen ? (
          <motion.span
            initial={{rotate: 0, scale: 0.8}}
            animate={{rotate: 360, scale: 1}}
            transition={{duration: 0.5}}
            className="text-green-500">
            <FontAwesomeIcon icon={faCircleCheck} size="lg" />
          </motion.span>
        ) : (
          <motion.span
            animate={{rotate: isOpen ? 180 : 0}}
            transition={{duration: 0.3}}
            className="transform">
            ▼
          </motion.span>
        )}
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
export const CustomAccordion = ({
  children,
  activeIndex = [],
  setActiveIndex,
  formStatus,
}) => {
  const renderedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      index,
      activeAccordions: activeIndex,
      setActiveAccordions: setActiveIndex,
      isCompleted: formStatus[index],
    })
  );

  return <div className="space-y-4">{renderedChildren}</div>;
};
