import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Description as ApplicationIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Helmet } from 'react-helmet-async';

const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Users',
      value: '12,458',
      change: '+12.5%',
      icon: <PeopleIcon />,
      color: 'primary',
    },
    {
      title: 'Universities',
      value: '10,234',
      change: '+8.2%',
      icon: <SchoolIcon />,
      color: 'success',
    },
    {
      title: 'Applications',
      value: '45,678',
      change: '+23.1%',
      icon: <ApplicationIcon />,
      color: 'info',
    },
    {
      title: 'Revenue',
      value: '$125,340',
      change: '+15.3%',
      icon: <MoneyIcon />,
      color: 'warning',
    },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 4000 },
    { month: 'Feb', users: 5200 },
    { month: 'Mar', users: 6100 },
    { month: 'Apr', users: 7800 },
    { month: 'May', users: 9500 },
    { month: 'Jun', users: 12458 },
  ];

  const applicationStatusData = [
    { name: 'Submitted', value: 400, color: '#667eea' },
    { name: 'Under Review', value: 300, color: '#764ba2' },
    { name: 'Accepted', value: 200, color: '#10b981' },
    { name: 'Rejected', value: 100, color: '#ef4444' },
  ];

  const recentActivities = [
    {
      user: 'John Doe',
      action: 'Registered',
      time: '2 minutes ago',
      type: 'user',
    },
    {
      user: 'Jane Smith',
      action: 'Submitted application to Harvard',
      time: '15 minutes ago',
      type: 'application',
    },
    {
      user: 'Mike Johnson',
      action: 'Added new university',
      time: '1 hour ago',
      type: 'university',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - StudyBridge</title>
      </Helmet>

      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome to the admin panel
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={800} gutterBottom>
                        {stat.value}
                      </Typography>
                      <Chip label={stat.change} size="small" color={stat.color} />
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}.main` }}>{stat.icon}</Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* User Growth Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  User Growth
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#667eea"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{activity.user[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={`${activity.user} • ${activity.time}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Application Status */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Application Status
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Quick Stats
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                    >
                      <Typography variant="body2">Pending Reviews</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        156
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={75} />
                  </Box>
                  <Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                    >
                      <Typography variant="body2">Active Users</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        8,234
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={65} />
                  </Box>
                  <Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                    >
                      <Typography variant="body2">Verified Universities</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        9,876
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={90} color="success" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdminDashboard;