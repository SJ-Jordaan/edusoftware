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
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li key={tab.label} className="mr-2">
              <button
                onClick={() => handleTabClick(tab.label)}
                className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
                  activeTab === tab.label
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
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
