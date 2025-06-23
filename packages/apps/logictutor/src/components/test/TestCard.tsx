import { useState } from 'react';
import {
  useCreateTestEntryMutation,
  useDeleteTestEntryMutation,
  useGetAllEntriesQuery,
} from '../../slices/testApi.slice';

export const TestCard = () => {
  const [text, setText] = useState(''); // <-- bind state to input

  const submitText = async () => {
    await createTestEntry({ testString: text });
    setText('');
    refetch();
  };

  const deleteText = async (testString: string) => {
    await deleteTestEntry({ testString });
    setText('');
    refetch();
  };

  const { data, error, isLoading, isFetching, refetch } =
    useGetAllEntriesQuery(undefined);
  const [createTestEntry, { isLoading: isCreating, error: createError }] =
    useCreateTestEntryMutation();
  const [deleteTestEntry, { isLoading: isDeleting, error: deleteError }] =
    useDeleteTestEntryMutation();

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        id="levelName"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition-all focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        required
      />

      <button
        disabled={isCreating || isDeleting}
        onClick={submitText}
        className="inline-flex w-full justify-center rounded-lg bg-orange-600 px-3 py-1.5 text-center text-xs font-medium text-white transition-all hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
      >
        Create Text
      </button>

      {createError && <p>{createError.toString()}</p>}
      {deleteError && <p>{deleteError.toString()}</p>}
      {(isLoading || isFetching) && <p>Loading...</p>}
      {data?.map((entry, index) => (
        <div key={index} className="flex justify-between gap-4">
          <p>{entry.testString}</p>
          <button
            disabled={isCreating || isDeleting}
            onClick={() => deleteText(entry.testString)}
            className="inline-flex justify-center rounded-lg bg-red-600 px-3 py-1.5 text-center text-xs font-medium text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
          >
            Delete Text
          </button>
        </div>
      ))}
      {error && <p>{error.toString()}</p>}
    </div>
  );
};
