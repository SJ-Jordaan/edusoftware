import { Toolbar } from '../grid-automaton-builder/Toolbar';
import { TrashBin } from '../grid-automaton-builder/TrashBin';
import GridCircuit from './GridCircuit';

interface GridBuilderProps {
  cellScale: 1 | 2;
  enableToolbar: boolean;
}
export const GridCircuitBuilder = ({
  cellScale,
  enableToolbar,
}: GridBuilderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <GridCircuit cellScale={cellScale} />

      {enableToolbar && (
        <>
          <TrashBin />
          <Toolbar cellScale={cellScale} />
        </>
      )}
    </div>
  );
};
