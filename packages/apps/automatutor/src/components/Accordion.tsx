import { LegacyRef, useState } from 'react';
import CrossArrowIcon from '../assets/cross-arrows-icon.svg?react';

interface AccordionItemProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  _ref: LegacyRef<HTMLDivElement>;
  onClick?: () => void;
  isDefaultExpanded?: boolean;
}

export const AccordionItem = ({
  id,
  title,
  children,
  _ref,
  onClick,
  isDefaultExpanded = false,
}: AccordionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const toggle = () => children && setIsExpanded(!isExpanded);

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick();
    }

    toggle();
  };

  return (
    <div ref={_ref}>
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-3 border border-b-0 border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 rtl:text-right dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-800 ${
          isExpanded
            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
            : ''
        }`}
        onClick={handleClick}
        aria-expanded={isExpanded}
        aria-controls={`accordion-collapse-body-${id}`}
      >
        <CrossArrowIcon className="fill-current stroke-current hover:cursor-grab" />
        <span>{title}</span>
        {children && (
          <svg
            className={`h-3 w-3 ${isExpanded ? '' : 'rotate-180'} shrink-0`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        )}
      </button>
      <div
        id={`accordion-collapse-body-${id}`}
        className={`${
          isExpanded ? 'block' : 'hidden'
        } border border-b-0 border-t-0 border-gray-200 p-5 dark:border-gray-700 `}
        aria-labelledby={`accordion-collapse-heading-${id}`}
      >
        {children}
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => {
  return (
    <div
      id="accordion-collapse"
      data-accordion="collapse"
      className="*:last-of-type:*:last-of-type:border-b"
    >
      {children}
    </div>
  );
};
