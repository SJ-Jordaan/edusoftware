import { PopulatedLevelObject } from '@edusoftware/core/src/types';
import { formatDate } from '../common/time';

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
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      <td className="py-4 px-6">{level.levelName}</td>
      <td className="py-4 px-6">{level.description}</td>
      <td className="py-4 px-6">{formatDate(level.startDate)}</td>
      <td className="py-4 px-6">{formatDate(level.endDate)}</td>
      <td className="py-4 px-6">
        <button
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
          onClick={() => onClick(`/admin/levels/${level._id}`)}
        >
          Edit
        </button>
        <button
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
          onClick={() => onDelete(level._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
};
