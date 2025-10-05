import { useEffect, useState, ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface DragAndDropProviderProps {
  children: ReactNode;
}

export const DragAndDropProvider = ({ children }: DragAndDropProviderProps) => {
  const [deviceType, setDeviceType] = useState<'touch' | 'mouse' | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileWidth = window.innerWidth < 1024;

      setDeviceType(isMobileWidth ? 'touch' : 'mouse');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!deviceType) {
    return null; // or a loading state if needed
  }

  if (deviceType === 'touch') {
    return <DndProvider backend={TouchBackend}>{children}</DndProvider>;
  }

  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};
