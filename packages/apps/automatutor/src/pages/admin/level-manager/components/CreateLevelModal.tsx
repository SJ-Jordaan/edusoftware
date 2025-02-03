import { useState } from 'react';
import Modal from '../../../../components/Modal';
import { Level } from '@edusoftware/core/src/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (level: Level) => Promise<void>;
}

export const CreateLevelModal = ({ isOpen, onClose, onClick }: ModalProps) => {
  const [levelName, setLevelName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Level">
      <form className="space-y-4">
        <div>
          <label
            htmlFor="levelName"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="levelName"
            id="levelName"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Type level name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write the level description here"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Start Date
          </label>
          <input
            type="datetime-local"
            name="startDate"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            End Date
          </label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={() =>
              onClick({ levelName, description, startDate, endDate })
            }
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {'Save Level'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
