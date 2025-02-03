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

  const { averageScorePerLevel, progressBreakdown, userCount } = data;

  const averageScoresOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: averageScorePerLevel.map((item) => `Level ${item._id}`),
      labels: {
        style: {
          colors: '#64748b',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
        },
      },
    },
    title: {
      text: 'Average Score Per Level',
      align: 'center',
      style: {
        color: '#64748b',
      },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
    },
  };

  const averageScoresSeries = [
    {
      name: 'Average Score',
      data: averageScorePerLevel.map((item) => item.averageScore),
    },
  ];

  const completionRateOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%';
      },
    },
    xaxis: {
      categories: progressBreakdown.map((item) => `Level ${item._id}`),
      labels: {
        style: {
          colors: '#64748b',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Completion Rate',
        style: {
          color: '#64748b',
        },
      },
      labels: {
        style: {
          colors: '#64748b',
        },
        formatter: function (val) {
          return val + '%';
        },
      },
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: 'Completion Rate Once Level is Started',
      align: 'center',
      style: {
        color: '#64748b',
      },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
    },
  };

  const completionRateSeries = [
    {
      name: 'Completion Rate',
      data: progressBreakdown.map((item) =>
        parseFloat(((item.completed / item.started) * 100).toFixed(2)),
      ),
    },
  ];

  const completionPercentageOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
        },
      },
    },
    labels: progressBreakdown.map((item) => `Level ${item._id}`),
    title: {
      text: 'Level Completion Percentage by Users',
      align: 'center',
      style: {
        color: '#64748b',
      },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
    },
  };

  const completionPercentageSeries = progressBreakdown.map((item) =>
    parseFloat(((item.completed / userCount) * 100).toFixed(2)),
  );

  return (
    <div className="container space-y-8 p-4 md:p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </h2>
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Total User Accounts
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {userCount}
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-gray-300 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${Math.min((userCount / 150) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Goal: 150 users
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <Chart
            options={averageScoresOptions}
            series={averageScoresSeries}
            type="bar"
            height={350}
          />
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <Chart
            options={completionRateOptions}
            series={completionRateSeries}
            type="bar"
            height={350}
          />
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <Chart
          options={completionPercentageOptions}
          series={completionPercentageSeries}
          type="radialBar"
          height={350}
        />
      </div>
    </div>
  );
};

export default Dashboard;
