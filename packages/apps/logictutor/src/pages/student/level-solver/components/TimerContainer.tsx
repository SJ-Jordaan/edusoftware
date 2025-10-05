import { NumberBox } from './NumberBox';

interface timeProps {
  minutes: number | string;
  seconds: number | string;
}

export const TimerContainer = ({ minutes, seconds }: timeProps) => {
  if (Number(minutes) < 10) {
    minutes = '0' + minutes;
  }

  if (Number(seconds) < 10) {
    seconds = '0' + seconds;
  }

  return (
    <div className="flex w-full justify-center gap-1">
      <NumberBox num={minutes} />
      <NumberBox num={seconds} />
    </div>
  );
};
