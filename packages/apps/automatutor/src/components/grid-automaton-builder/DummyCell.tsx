interface DummyCellProps {
  children: React.ReactNode;
}

export const DummyCell = ({ children }: DummyCellProps) => {
  return (
    <div
      className={
        'box-border flex h-14 w-14 flex-col items-center justify-center justify-self-center border border-gray-700'
      }
    >
      {children}
    </div>
  );
};
