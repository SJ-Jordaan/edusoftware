import GridCircuit from './GridCircuit';

interface GridBuilderProps {
  cellScale: 1 | 2;
}
export const GridCircuitBuilder = ({ cellScale }: GridBuilderProps) => {
  return (
    <div className="flex flex-col">
      <GridCircuit cellScale={cellScale} />

      {/* {isEditable && (
        <>
          <TrashBin />
          <Toolbar />
        </>
      )} */}
    </div>
  );
};
