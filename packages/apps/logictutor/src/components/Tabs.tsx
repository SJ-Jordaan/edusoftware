import { useState, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  onSelect?: (label: string) => void;
}

export const Tabs = ({ tabs, onSelect }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const handleTabClick = (label: string) => {
    setActiveTab(label);
    onSelect?.(label);
  };

  return (
    <div>
      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          {tabs.map((tab) => (
            <li key={tab.label} className="mr-2">
              <button
                onClick={() => handleTabClick(tab.label)}
                className={`inline-block rounded-t-lg border-b-2 p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 ${
                  activeTab === tab.label
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                    : 'border-transparent'
                }`}
                aria-current={activeTab === tab.label ? 'page' : undefined}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>{tabs.find((tab) => tab.label === activeTab)?.content}</div>
    </div>
  );
};
