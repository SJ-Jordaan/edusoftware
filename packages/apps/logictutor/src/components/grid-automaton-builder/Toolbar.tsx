import { useAppSelector } from '../../store';
import { DraggableGate } from '../grid-circuit/DraggableGate';
import { DummyCell } from './DummyCell';

export const Toolbar = () => {
  const toolbar = useAppSelector((state) => state.gridCircuit.toolbar);

  return (
    <div className="flex flex-wrap gap-1">
      {toolbar.map(
        (item, index) =>
          item.gateType && (
            <DummyCell key={`${item.gateType}-${index}`}>
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
