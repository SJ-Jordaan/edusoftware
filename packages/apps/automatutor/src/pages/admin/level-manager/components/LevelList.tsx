import { PopulatedLevelObject } from '@edusoftware/core/src/types';
import { formatDate } from '../../common/time';

interface LevelListProps {
  levels: PopulatedLevelObject[];
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LevelList = ({ levels, onClick, onDelete }: LevelListProps) => {
  if (levels.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No levels found
      </div>
    );
  }

  return levels.map((level) => (
    <tr
      key={level._id}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className="px-6 py-4">{level.levelName}</td>
      <td className="px-6 py-4">{level.description}</td>
      <td className="px-6 py-4">{formatDate(level.startDate)}</td>
      <td className="px-6 py-4">{formatDate(level.endDate)}</td>
      <td className="px-6 py-4">
        <button
          className="mr-3 font-medium text-blue-600 hover:underline dark:text-blue-500"
          onClick={() => onClick(`/admin/levels/${level._id}`)}
        >
          Edit
        </button>
        <button
          className="font-medium text-red-600 hover:underline dark:text-red-500"
          onClick={() => onDelete(level._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
};
