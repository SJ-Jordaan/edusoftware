interface numProp {
  num: string | number;
  unit?: string;
}

export const NumberBox = ({ num, unit }: numProp) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-8 w-8 flex-col items-center justify-center rounded-lg bg-transparent">
        <div className="absolute z-10 font-mono text-lg font-bold text-rose-500">
          {num}
        </div>
        <div className="h-full w-full rounded-b-lg rounded-t-lg bg-[#2c2e3f]"></div>
      </div>
      {unit && (
        <p className="mt-3 text-sm font-semibold text-rose-200">{unit}</p>
      )}
    </div>
  );
};
