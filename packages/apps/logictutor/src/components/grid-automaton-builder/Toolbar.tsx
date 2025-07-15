import { useAppSelector } from '../../store';
import { DraggableGate } from '../grid-circuit/DraggableGate';
import { DummyCell } from './DummyCell';

interface ToolbarProps {
  cellScale: number;
}

export const Toolbar = ({ cellScale }: ToolbarProps) => {
  const toolbar = useAppSelector((state) => state.gridCircuit.toolbar);

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {toolbar.map(
        (item, index) =>
          item.gateType && (
            <DummyCell key={`${item.gateType}-${index}`} cellScale={cellScale}>
              <DraggableGate
                gateType={item.gateType}
                inputLabel={item.label}
                isNew
              />
            </DummyCell>
          ),
      )}
    </div>
  );
};
