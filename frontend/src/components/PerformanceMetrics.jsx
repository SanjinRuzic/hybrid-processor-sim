import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  Cpu,
  Zap,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  Target
} from 'lucide-react';

const PerformanceMetrics = ({ performanceData, isRealTime = true }) => {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('throughput');
  const [historicalData, setHistoricalData] = useState([]);

  // Generate mock performance data
  const generateMockData = (points = 50) => {
    const now = Date.now();
    return Array.from({ length: points }, (_, i) => {
      const time = now - (points - i) * 60000; // 1 minute intervals
      const baseTime = i * 2;
      return {
        timestamp: time,
        timeLabel: new Date(time).toLocaleTimeString(),
        throughput: 850 + Math.sin(baseTime * 0.1) * 200 + Math.random() * 100,
        latency: 2.5 + Math.sin(baseTime * 0.15) * 0.8 + Math.random() * 0.5,
        cpuUsage: 45 + Math.sin(baseTime * 0.08) * 15 + Math.random() * 10,
        memoryUsage: 60 + Math.sin(baseTime * 0.05) * 20 + Math.random() * 8,
        quantumEfficiency:
          92 + Math.sin(baseTime * 0.12) * 5 + Math.random() * 3,
        errorRate: Math.max(
          0,
          0.1 + Math.sin(baseTime * 0.2) * 0.08 + Math.random() * 0.05
        ),
        powerConsumption:
          120 + Math.sin(baseTime * 0.06) * 30 + Math.random() * 15,
        temperature: 35 + Math.sin(baseTime * 0.04) * 8 + Math.random() * 4
      };
    });
  };

  const mockCurrentMetrics = {
    throughput: { value: 1247, unit: 'ops/sec', change: 8.3, status: 'good' },
    latency: { value: 2.1, unit: 'ms', change: -12.5, status: 'excellent' },
    availability: { value: 99.97, unit: '%', change: 0.02, status: 'excellent' },
    errorRate: { value: 0.03, unit: '%', change: -45.2, status: 'good' },
    quantumCoherence: { value: 87.3, unit: '%', change: 2.1, status: 'good' },
    powerEfficiency: { value: 94.2, unit: '%', change: 5.7, status: 'excellent' }
  };

  const data = performanceData || mockCurrentMetrics;

  // Update historical data every 5 seconds if real-time mode
  useEffect(() => {
    if (isRealTime) {
      setHistoricalData(generateMockData(50)); // initial load
      const interval = setInterval(() => {
        setHistoricalData(generateMockData(50));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  // Mapping metric to fixed colors and keys for sparkline
  const metricColorMap = {
    throughput: 'blue',
    latency: 'green',
    errorRate: 'red',
    cpuUsage: 'purple'
  };

  // Fix for dynamic tailwind class: use fixed class names instead of template strings
  const getStatusBgClass = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100';
      case 'good':
        return 'bg-blue-100';
      case 'warning':
        return 'bg-yellow-100';
      default:
        return 'bg-red-100';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'excellent' || status === 'good') {
      return (
        <CheckCircle
          size={16}
          className={`${
            status === 'excellent' ? 'text-green-500' : 'text-blue-500'
          }`}
        />
      );
    }
    return <AlertCircle size={16} className="text-yellow-500" />;
  };

  const MetricCard = ({ title, metric, icon: Icon, colorKey }) => {
    // Decide which key to plot in sparkline based on metric title
    let dataKey = 'cpuUsage';
    if (title.toLowerCase().includes('throughput')) dataKey = 'throughput';
    else if (title.toLowerCase().includes('latency')) dataKey = 'latency';
    else if (title.toLowerCase().includes('error')) dataKey = 'errorRate';

    // Map colorKey to actual color string for stroke
    const strokeColor = {
      blue: '59, 130, 246',
      green: '34, 197, 94',
      purple: '147, 51, 234',
      orange: '249, 115, 22',
      gray: '107, 114, 128'
    }[colorKey] || '107, 114, 128';

    // Ensure metric and its properties are not undefined before accessing
    const displayValue = metric?.value ?? 'N/A';
    const displayUnit = metric?.unit ?? '';
    const displayChange = metric?.change ?? 0;
    const displayStatus = metric?.status ?? 'unknown';


    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon size={20} className={`text-${colorKey}-500 mr-2`} />
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className={`p-1 rounded-full ${getStatusBgClass(displayStatus)}`}>
            {getStatusIcon(displayStatus)}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {typeof displayValue === 'number'
                ? displayValue.toLocaleString()
                : displayValue}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {displayUnit}
              </span>
            </div>
            <div
              className={`text-sm font-medium mt-1 ${
                displayChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {displayChange > 0 ? '+' : ''}
              {displayChange.toFixed(1)}% from last hour
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              {/* Add check for historicalData length before rendering LineChart */}
              {historicalData.length > 0 && (
                <LineChart data={historicalData.slice(-10)}>
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={`rgb(${strokeColor})`}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const SystemHealthIndicator = () => {
    const overallHealth = useMemo(() => {
      // Safely access nested properties with optional chaining and provide default values
      const availability = data.availability?.value ?? 0;
      // Assuming errorRate is a percentage, convert to a score where 0% error is 100 score
      const errorRateScore = 100 - ((data.errorRate?.value ?? 10) * 10); // Default error rate 10% if undefined
      const quantumCoherence = data.quantumCoherence?.value ?? 0;
      const powerEfficiency = data.powerEfficiency?.value ?? 0;

      const scores = [
        availability,
        errorRateScore,
        quantumCoherence,
        powerEfficiency
      ];

      // Filter out NaN values that might result from calculations if inputs are not numbers
      const validScores = scores.filter(score => typeof score === 'number' && !isNaN(score));

      if (validScores.length === 0) {
          return 0; // Return 0 if no valid scores to prevent division by zero
      }

      return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    }, [data]); // Dependency array includes data

    const healthColor =
      overallHealth >= 95
        ? 'green'
        : overallHealth >= 85
        ? 'blue'
        : overallHealth >= 75
        ? 'yellow'
        : 'red';

    const strokeColors = {
      green: '34, 197, 94',
      blue: '59, 130, 246',
      yellow: '245, 158, 11',
      red: '239, 68, 68'
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">System Health</h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium bg-${healthColor}-100 text-${healthColor}-700`}
          >
            {overallHealth >= 95
              ? 'Excellent'
              : overallHealth >= 85
              ? 'Good'
              : overallHealth >= 75
              ? 'Fair'
              : 'Poor'}{' '}
            ({overallHealth.toFixed(1)}%) {/* Display percentage here */}
          </div>
        </div>

        <div className="relative w-full h-36">
          <ResponsiveContainer width="100%" height="100%">
             {/* Add check for overallHealth being a valid number before rendering AreaChart */}
            {typeof overallHealth === 'number' && !isNaN(overallHealth) && (
              <AreaChart data={[{ value: overallHealth }]}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={`rgba(${strokeColors[healthColor]}, 0.8)`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`rgba(${strokeColors[healthColor]}, 0.1)`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={`rgb(${strokeColors[healthColor]})`}
                  fill="url(#colorHealth)"
                  strokeWidth={3}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis
                  domain={[0, 100]}
                  tickCount={6}
                  tickFormatter={(tick) => `${tick}%`}
                />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              </AreaChart>
            )}
          </ResponsiveContainer>
           {/* Remove the absolute positioned percentage display to avoid duplication */}
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-4xl font-bold text-gray-700">
              {overallHealth.toFixed(1)}%
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Overview metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Throughput"
          metric={data.throughput || { value: 0, unit: 'N/A', change: 0, status: 'unknown' }}
          icon={TrendingUp}
          colorKey="blue"
        />
        <MetricCard
          title="Latency"
          metric={data.latency || { value: 0, unit: 'N/A', change: 0, status: 'unknown' }}
          icon={Clock}
          colorKey="green"
        />
        <MetricCard
          title="Error Rate"
          metric={data.errorRate || { value: 0, unit: 'N/A', change: 0, status: 'unknown' }}
          icon={AlertCircle}
          colorKey="red"
        />
        <MetricCard
          title="CPU Usage"
          metric={data.cpuUsage || { value: 45, unit: '%', change: 3, status: 'good' }}
          icon={Cpu}
          colorKey="purple"
        />
        <MetricCard
          title="Quantum Efficiency"
          metric={data.quantumCoherence || { value: 90, unit: '%', change: 1, status: 'good' }}
          icon={Zap}
          colorKey="orange"
        />
        <MetricCard
          title="Power Efficiency"
          metric={data.powerEfficiency || { value: 90, unit: '%', change: 1, status: 'good' }}
          icon={Activity}
          colorKey="gray"
        />
      </div>

      {/* System health section */}
      <SystemHealthIndicator />
    </div>
  );
};

export default PerformanceMetrics;
