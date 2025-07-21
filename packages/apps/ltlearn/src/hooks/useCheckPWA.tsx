import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { InstallToast } from '../components';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

export const useCheckPWA = () => {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        beforeInstallPromptHandler,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    promptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setPromptEvent(null);
    });
  };

  useEffect(() => {
    if (
      !window.matchMedia('(display-mode: standalone)').matches &&
      promptEvent
    ) {
      toast(
        ({ closeToast }) => (
          <InstallToast onClose={closeToast} onUpdate={handleInstallClick} />
        ),
        {
          toastId: 'install-toast',
          autoClose: false,
          closeButton: false,
        },
      );
    }
  }, [promptEvent]);
};
