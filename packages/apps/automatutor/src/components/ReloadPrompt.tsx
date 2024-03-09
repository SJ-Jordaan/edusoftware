import { useRegisterSW } from 'virtual:pwa-register/react';

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

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="m-0 h-0 w-0 p-0">
      {(offlineReady || needRefresh) && (
        <div className="fixed bottom-0 right-0 m-4 rounded border bg-gray-50 p-3 text-left shadow">
          <div className="mb-2">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>
                New content available, click on reload button to update.
              </span>
            )}
          </div>
          {needRefresh && (
            <button
              className="broder mr-1 rounded px-1 py-2 outline-none"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button
            className="broder mr-1 rounded px-1 py-2 outline-none"
            onClick={() => close()}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
