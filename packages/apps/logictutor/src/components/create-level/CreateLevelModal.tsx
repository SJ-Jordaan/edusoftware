import { useState } from 'react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const useCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return { isOpen, openModal, closeModal };
};

const CreateModal = ({
  isOpen,
  onClose,
  title,
  children,
}: CreateModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-screen items-center justify-center bg-gray-800/50  shadow-lg backdrop-blur-md">
        <div className="relative p-4">
          <div
            className="relative flex flex-col rounded-lg bg-slate-900 shadow"
            style={{
              maxHeight: 'calc(100vh - 200px)',
              minHeight: 'min(600px, 100vh - 40px)',
            }}
          >
            <div className="sticky top-0 flex items-start justify-between rounded-t-lg border-b border-gray-600 bg-slate-900 p-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="h-full overflow-y-auto p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { useCreateModal };
export default CreateModal;
