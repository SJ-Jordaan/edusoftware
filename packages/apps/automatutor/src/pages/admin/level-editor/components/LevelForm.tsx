import { ChangeEvent, FormEvent } from 'react';

interface LevelFormProps {
  levelName: string;
  description: string;
  startDate: string;
  endDate: string;
  onUpdate: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const LevelForm = ({
  levelName,
  description,
  startDate,
  endDate,
  onUpdate,
  onSubmit,
}: LevelFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {'Update Level'}
        </button>
      </div>
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
          onChange={onUpdate}
          className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
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
          onChange={onUpdate}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
          onChange={onUpdate}
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
          onChange={onUpdate}
          className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          required
        />
      </div>
    </form>
  );
};
