import { toast } from 'react-toastify';
import { useCheckBadgeProgressMutation } from '../slices/badgeApi.slice';
import { BadgeToast } from '../components';
import { Badge } from '@edusoftware/core/src/types';

export const useCheckBadges = () => {
  const [checkBadges] = useCheckBadgeProgressMutation();

  const showBadgeToast = (badge: Badge) => {
    toast(
      ({ closeToast }) => <BadgeToast badge={badge} onClose={closeToast} />,
      {
        toastId: `badge-${badge._id}`,
        autoClose: 5000,
        closeButton: false,
        position: 'bottom-right',
      },
    );
  };

  const checkForBadges = async (metric: string, value: number) => {
    try {
      const response = await checkBadges({
        metric,
        value,
      }).unwrap();

      if (response.newBadges?.length > 0) {
        response.newBadges.forEach(showBadgeToast);
      }
    } catch (error) {
      console.error('Failed to check badges:', error);
    }
  };

  return { checkForBadges, showBadgeToast };
};
