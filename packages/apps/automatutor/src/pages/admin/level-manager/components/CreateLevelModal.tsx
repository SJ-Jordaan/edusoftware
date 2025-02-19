import { useState } from 'react';
import Modal from '../../../../components/Modal';
import { Level, OrganisationName } from '@edusoftware/core/src/types';

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
  const [organisation, setOrganisation] = useState(OrganisationName.PUBLIC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClick({
      levelName,
      description,
      startDate,
      endDate,
      organisation,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Level">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Enter level name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="organisation"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Organisation
            </label>
            <select
              id="organisation"
              value={organisation}
              onChange={(e) =>
                setOrganisation(e.target.value as OrganisationName)
              }
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            >
              {Object.values(OrganisationName).map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>
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
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Write the level description here"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Level
          </button>
        </div>
      </form>
    </Modal>
  );
};
