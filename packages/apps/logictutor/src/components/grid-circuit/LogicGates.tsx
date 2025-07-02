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
      <line x1="0" y1="37" x2="11" y2="37" stroke="#34d399" strokeWidth="2" />
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
      <line x1="0" y1="37" x2="15" y2="37" stroke="#34d399" strokeWidth="2" />
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
      <line x1="0" y1="28" x2="11" y2="28" stroke="#34d399" strokeWidth="2" />
      <line x1="46" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
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
      <line x1="0" y1="37" x2="12" y2="37" stroke="#34d399" strokeWidth="2" />
      <line x1="48" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
    </svg>
  );
};

export const InputGate: React.FC<{ label: string }> = ({ label }) => {
  return (
    <svg width={size * scale} height={size * scale} viewBox="0 0 56 56">
      <circle
        cx="43"
        cy="28"
        r="3"
        stroke="#34d399"
        fill="none"
        strokeWidth="2"
      />
      <line x1="47" y1="28" x2="56" y2="28" stroke="#34d399" strokeWidth="2" />
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        alignmentBaseline="middle"
        fontSize="30"
        fill="#34d399"
      >
        {label[0]}
      </text>
    </svg>
  );
};

export const OutputGate: React.FC<{ label: string }> = ({ label }) => {
  return (
    <svg width={size * scale} height={size * scale} viewBox="0 0 56 56">
      <circle
        cx="13"
        cy="28"
        r="3"
        stroke="#34d399"
        fill="none"
        strokeWidth="2"
      />
      <line x1="0" y1="28" x2="9" y2="28" stroke="#34d399" strokeWidth="2" />
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        alignmentBaseline="middle"
        fontSize="30"
        fill="#34d399"
      >
        {label[0]}
      </text>
    </svg>
  );
};

export type GateType = 'and' | 'or' | 'not' | 'xor' | 'input' | 'output';

export const gateMap = (
  gateType: GateType,
  inputLabel?: string,
): JSX.Element => {
  switch (gateType) {
    case 'and':
      return <AndGate />;
    case 'or':
      return <OrGate />;
    case 'not':
      return <NotGate />;
    case 'xor':
      return <XorGate />;
    case 'input':
      return <InputGate label={inputLabel ?? 'X'} />;
    case 'output':
      return <OutputGate label={inputLabel ?? 'X'} />;
  }
};
