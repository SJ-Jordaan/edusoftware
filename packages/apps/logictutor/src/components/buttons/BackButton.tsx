import { useNavigate } from 'react-router-dom';
import BackIcon from '../../assets/line-angle-left-icon.svg?react';

export const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center text-gray-800 dark:text-gray-50"
    >
      <BackIcon className="mr-2 h-4 w-4 fill-gray-800 dark:fill-gray-50" /> Back
    </button>
  );
};
