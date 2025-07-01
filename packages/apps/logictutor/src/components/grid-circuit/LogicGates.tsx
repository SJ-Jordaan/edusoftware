const size = 56;
const scale = 2;

export interface GateProps {
  scale: number;
}

export const AndGate = () => {
  return (
    <svg width={size * scale} height={size * scale} viewBox="0 0 56 56">
      <path
        d="M11,11 h22 a18,18 0 0 1 0,34 h-22 z"
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
      />
      <line x1="0" y1="18" x2="11" y2="18" stroke="#34d399" strokeWidth="2" />
      <line x1="0" y1="36" x2="11" y2="36" stroke="#34d399" strokeWidth="2" />
      <line x1="45" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
    </svg>
  );
};

export const OrGate = () => {
  return (
    <svg width={size * scale} height={size * scale} viewBox="0 0 56 56">
      <path
        d="M6,11 a18,18 0 0 1 0,34 h15 a30,30 0 0 0 24,-17 a30,30 0 0 0 -24,-17 h-15 z"
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
      />
      <line x1="0" y1="18" x2="15" y2="18" stroke="#34d399" strokeWidth="2" />
      <line x1="0" y1="36" x2="15" y2="36" stroke="#34d399" strokeWidth="2" />
      <line x1="45" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
    </svg>
  );
};

export const NotGate = () => {
  return (
    <svg width={size * scale} height={size * scale} viewBox="0 0 56 56">
      <line x1="11" y1="11" x2="11" y2="45" stroke="#34d399" strokeWidth="2" />
      <line x1="11" y1="11" x2="40" y2="28" stroke="#34d399" strokeWidth="2" />
      <line x1="40" y1="28" x2="11" y2="45" stroke="#34d399" strokeWidth="2" />
      <circle
        cx="43"
        cy="28"
        r="3"
        stroke="#34d399"
        fill="none"
        strokeWidth="2"
      />
      <line x1="0" y1="18" x2="11" y2="18" stroke="#34d399" strokeWidth="2" />
      <line x1="0" y1="36" x2="11" y2="36" stroke="#34d399" strokeWidth="2" />
      <line x1="47" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
    </svg>
  );
};

export const XorGate = () => {
  return (
    <svg width={size * scale} height={size * scale} viewBox="0 0 56 56">
      <path
        d="M9,11 a18,18 0 0 1 0,34 h15 a30,30 0 0 0 24,-17 a30,30 0 0 0 -24,-17 h-15 z"
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
      />
      <path
        d="M3,11 a18,18 0 0 1 0,34"
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
      />
      <line x1="0" y1="18" x2="12" y2="18" stroke="#34d399" strokeWidth="2" />
      <line x1="0" y1="36" x2="12" y2="36" stroke="#34d399" strokeWidth="2" />
      <line x1="48" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
    </svg>
  );
};

export type GateType = 'and' | 'or' | 'not' | 'xor';

export const gateMap: Record<GateType, JSX.Element> = {
  and: <AndGate />,
  or: <OrGate />,
  not: <NotGate />,
  xor: <XorGate />,
};
