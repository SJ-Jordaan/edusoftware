import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useFetchDashboardQuery } from '../../../slices/reportApi.slice';
import ErrorPage from '../../ErrorPage';
import { DashboardLoader } from './DashboardLoader';

const Dashboard = () => {
  const { data, error, isLoading } = useFetchDashboardQuery();

  if (isLoading) return <DashboardLoader />;
  if (error) return <ErrorPage />;
  if (!data) return <div className="text-center">No data available</div>;

  const { levelStats, userCount, lastUpdated } = data;

  const averageScoresOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} pts`,
    },
    xaxis: {
      categories: levelStats.map((item) => item.levelName),
      labels: {
        style: { colors: '#64748b' },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b' },
      },
    },
    title: {
      text: 'Average Points Per Level',
      align: 'center',
      style: { color: '#64748b' },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
    },
  };

  const completionRateOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
    },
    xaxis: {
      categories: levelStats.map((item) => item.levelName),
      labels: {
        style: { colors: '#64748b' },
      },
    },
    yaxis: {
      title: {
        text: 'Completion Rate',
        style: { color: '#64748b' },
      },
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => `${val}%`,
      },
    },
    title: {
      text: 'Level Completion Statistics',
      align: 'center',
      style: { color: '#64748b' },
    },
  };

  return (
    <div className="container mx-auto space-y-8 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={userCount}
          change="+12% from last month"
          icon="👥"
        />
        <StatCard
          title="Total Levels"
          value={levelStats.length}
          change="All levels running"
          icon="📚"
        />
        <StatCard
          title="Average Completion"
          value={`${Math.round(
            levelStats.reduce((acc, curr) => acc + curr.completionRate, 0) /
              levelStats.length,
          )}%`}
          change="Across all levels"
          icon="🎯"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <Chart
            options={averageScoresOptions}
            series={[
              {
                name: 'Average Score',
                data: levelStats.map((item) => item.averageScore),
              },
            ]}
            type="bar"
            height={350}
          />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <Chart
            options={completionRateOptions}
            series={[
              {
                name: 'Completion Rate',
                data: levelStats.map((item) => item.completionRate),
              },
            ]}
            type="bar"
            height={350}
          />
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
          Level Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-gray-500">
                <th className="pb-3">Level Name</th>
                <th className="pb-3">Students</th>
                <th className="pb-3">In Progress</th>
                <th className="pb-3">Completed</th>
                <th className="pb-3">Avg. Points</th>
              </tr>
            </thead>
            <tbody>
              {levelStats.map((level) => (
                <tr
                  key={level.levelId}
                  className="border-b text-sm text-gray-600 dark:text-gray-300"
                >
                  <td className="py-3">{level.levelName}</td>
                  <td className="py-3">{level.totalStudents}</td>
                  <td className="py-3">{level.inProgress}</td>
                  <td className="py-3">{level.completed}</td>
                  <td className="py-3">{level.averageScore} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: number | string;
  change: string;
  icon: string;
}) => (
  <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{change}</p>
  </div>
);

export default Dashboard;
