import { Badges } from '../components/Badges';

const BadgePage = () => {
  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold text-white">Your Badges</h1>
      <Badges />
    </div>
  );
};

export default BadgePage;
