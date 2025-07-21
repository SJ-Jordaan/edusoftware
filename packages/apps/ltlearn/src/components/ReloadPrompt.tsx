import { useRegisterSW } from 'virtual:pwa-register/react';
import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const [visible, setVisible] = useState(false);

  // Animation control - delay showing the modal for a smoother entrance
  useEffect(() => {
    if (offlineReady || needRefresh) {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [offlineReady, needRefresh]);

  const close = () => {
    setVisible(false);
    // Short delay before setting states to allow exit animation
    setTimeout(() => {
      setOfflineReady(false);
      setNeedRefresh(false);
    }, 300);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`mx-4 w-full max-w-md transform rounded-2xl bg-slate-800 p-6 text-center shadow-2xl ring-1 ring-slate-700 transition-all duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-8'
        }`}
      >
        <div className="mb-6 flex justify-center">
          {offlineReady ? (
            <div className="rounded-full bg-green-900/20 p-3">
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          ) : (
            <div className="rounded-full bg-blue-900/20 p-3">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-white">
          {offlineReady ? 'Ready for Offline Use' : 'Update Available'}
        </h3>

        <p className="mb-6 text-slate-300">
          {offlineReady
            ? 'AutomaTutor has been installed on your device and can now work without an internet connection.'
            : 'A new version of AutomaTutor is available. Reload to update and get the latest features.'}
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-end">
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="w-full rounded-lg bg-orange-500 px-5 py-2.5 text-center font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 sm:w-auto"
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowPathIcon className="h-4 w-4" />
                <span>Reload & Update</span>
              </div>
            </button>
          )}

          <button
            onClick={close}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-5 py-2.5 text-center font-medium text-white transition-colors hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 sm:w-auto"
          >
            <div className="flex items-center justify-center gap-2">
              {!needRefresh && <CheckCircleIcon className="h-4 w-4" />}
              <span>{needRefresh ? 'Later' : 'Continue'}</span>
            </div>
          </button>
        </div>

        {/* Mobile experience enhancement: Close button on top-right */}
        <button
          onClick={close}
          className="absolute -right-2 -top-2 rounded-full bg-slate-700 p-1 text-slate-400 shadow-lg hover:bg-slate-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 sm:-right-3 sm:-top-3 sm:p-1.5"
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
