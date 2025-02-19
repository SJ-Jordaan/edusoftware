import { OrganisationName } from '@edusoftware/core/src/types';

interface LevelFormProps {
  levelName: string;
  description: string;
  startDate: string;
  endDate: string;
  organisation: string;
  onSubmit: () => void;
  onUpdate: (key: string, value: string) => void;
}

export const LevelForm = ({
  levelName,
  description,
  startDate,
  endDate,
  organisation,
  onSubmit,
  onUpdate,
}: LevelFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
    >
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
            id="levelName"
            value={levelName}
            onChange={(e) => onUpdate('levelName', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
            onChange={(e) => onUpdate('organisation', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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

      <div className="mt-6">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          required
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="startDate"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => onUpdate('startDate', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
            id="endDate"
            value={endDate}
            onChange={(e) => onUpdate('endDate', e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
