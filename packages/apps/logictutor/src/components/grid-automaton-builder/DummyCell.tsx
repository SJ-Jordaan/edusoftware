interface DummyCellProps {
  children: React.ReactNode;
  cellScale: number;
}

export const DummyCell = ({ children, cellScale }: DummyCellProps) => {
  return (
    <div
      className={`box-border flex h-${cellScale * 14} w-${cellScale * 14} flex-col items-center justify-center justify-self-center border border-gray-700`}
    >
      {children}
    </div>
  );
};
