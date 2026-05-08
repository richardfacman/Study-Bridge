import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Helmet } from 'react-helmet-async';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');

  // Mock data
  const userGrowthData = [
    { date: 'Jan', users: 1200, applications: 450 },
    { date: 'Feb', users: 1900, applications: 780 },
    { date: 'Mar', users: 2500, applications: 1050 },
    { date: 'Apr', users: 3200, applications: 1400 },
    { date: 'May', users: 4100, applications: 1850 },
    { date: 'Jun', users: 5200, applications: 2300 },
  ];

  const countryDistribution = [
    { name: 'USA', value: 400, color: '#667eea' },
    { name: 'UK', value: 300, color: '#764ba2' },
    { name: 'Canada', value: 200, color: '#f093fb' },
    { name: 'Australia', value: 150, color: '#4facfe' },
    { name: 'Germany', value: 100, color: '#43e97b' },
  ];

  const popularUniversities = [
    { name: 'Harvard', applications: 450 },
    { name: 'Stanford', applications: 380 },
    { name: 'MIT', applications: 350 },
    { name: 'Oxford', applications: 320 },
    { name: 'Cambridge', applications: 280 },
  ];

  const applicationStatusData = [
    { month: 'Jan', submitted: 120, accepted: 45, rejected: 30 },
    { month: 'Feb', submitted: 190, accepted: 78, rejected: 42 },
    { month: 'Mar', submitted: 250, accepted: 105, rejected: 55 },
    { month: 'Apr', submitted: 320, accepted: 140, rejected: 68 },
    { month: 'May', submitted: 410, accepted: 185, rejected: 82 },
    { month: 'Jun', submitted: 520, accepted: 230, rejected: 95 },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics - Admin</title>
      </Helmet>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>
            Analytics & Insights
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* User Growth */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  User Growth & Applications
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#667eea"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#764ba2"
                      fillOpacity={1}
                      fill="url(#colorApps)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Country Distribution */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Students by Country
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={countryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} (${entry.value})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {countryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Application Status Trends */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Application Status Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="submitted"
                      stroke="#667eea"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="accepted"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Universities */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Most Applied Universities
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularUniversities} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="applications" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Analytics;