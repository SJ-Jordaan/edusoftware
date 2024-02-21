import { useState } from 'react';
import Modal from '../../../components/Modal';
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
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            name="levelName"
            id="levelName"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Type level name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write the level description here"
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Start Date
          </label>
          <input
            type="datetime-local"
            name="startDate"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            End Date
          </label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={() =>
              onClick({ levelName, description, startDate, endDate })
            }
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {'Save Level'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
