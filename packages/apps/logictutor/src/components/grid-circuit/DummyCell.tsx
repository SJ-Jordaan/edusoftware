interface DummyCellProps {
  children: React.ReactNode;
  cellScale: number;
}

export const DummyCell = ({ children, cellScale }: DummyCellProps) => {
  return (
    <div
      className={
        'box-border flex flex-col items-center justify-center justify-self-center border border-gray-700'
      }
      style={{
        width: `${cellScale * 3.5}rem`,
        height: `${cellScale * 3.5}rem`,
      }}
    >
      {children}
    </div>
  );
};
