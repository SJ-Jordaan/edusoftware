import { useEffect } from 'react';

export const usePreventOverscroll = (): void => {
  useEffect(() => {
    const originalStyleHtml = document.documentElement.style.overscrollBehavior;
    const originalStyleBody = document.body.style.overscrollBehavior;

    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.documentElement.style.overscrollBehavior = originalStyleHtml;
      document.body.style.overscrollBehavior = originalStyleBody;
    };
  }, []);
};
