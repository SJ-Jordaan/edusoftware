interface StepsListProps {
  steps: { _id: string }[];
  currentStepId: string;
}

export const StepsList = ({ steps, currentStepId }: StepsListProps) => {
  // Determine the index of the current step
  const currentStepIndex = steps.findIndex(
    (step) => step._id === currentStepId,
  );
  const maxStepsToShow = 5;

  // Calculate the range of steps to show
  let start = Math.max(0, currentStepIndex - Math.floor(maxStepsToShow / 2));
  let end = start + maxStepsToShow;
  if (end > steps.length) {
    end = steps.length;
    start = Math.max(0, end - maxStepsToShow);
  }

  // Select steps to display
  const stepsToShow = steps.slice(start, end);

  return (
    <ol className="flex w-full items-center overflow-x-auto">
      {stepsToShow.map((step, index) => (
        <li key={`step-${step._id}`} className="relative w-full">
          <div className="flex items-center text-sm">
            <div
              className={`z-10 flex h-6 w-6 items-center justify-center ${
                step._id === currentStepId ? 'bg-blue-600' : 'bg-gray-200'
              } rounded-full ring-0 ring-white ${
                step._id === currentStepId
                  ? 'dark:bg-blue-900'
                  : 'dark:bg-gray-700'
              } shrink-0 sm:ring-8 dark:ring-gray-900`}
            >
              {step._id === currentStepId ? (
                <span className="text-white">→</span> // Arrow for the current step
              ) : index < currentStepIndex ? (
                <svg // Checkmark for completed steps
                  className="h-4 w-4 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-white">{index + 1 + start}</span> // Step number for future steps
              )}
            </div>
            {index < stepsToShow.length - 1 && (
              <div className="flex h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};
