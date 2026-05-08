import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import {
  School as SchoolIcon,
  CardGiftcard as ScholarshipIcon,
  Description as DocumentIcon,
  FlightTakeoff as VisaIcon,
  TrendingUp as TrendingIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const features = [
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'University Search',
    description: 'Discover 10,000+ universities worldwide with advanced filters and AI recommendations.',
    color: '#667eea',
  },
  {
    icon: <ScholarshipIcon sx={{ fontSize: 40 }} />,
    title: 'Scholarship Database',
    description: 'Access thousands of scholarships with personalized matching and deadline alerts.',
    color: '#764ba2',
  },
  {
    icon: <DocumentIcon sx={{ fontSize: 40 }} />,
    title: 'Application Tracking',
    description: 'Manage multiple applications with document checklists and status updates.',
    color: '#f093fb',
  },
  {
    icon: <VisaIcon sx={{ fontSize: 40 }} />,
    title: 'Visa Guidance',
    description: 'Country-specific visa guides with requirement checklists and financial calculators.',
    color: '#4facfe',
  },
];

const stats = [
  { value: '10,000+', label: 'Universities' },
  { value: '5,000+', label: 'Scholarships' },
  { value: '150+', label: 'Countries' },
  { value: '50,000+', label: 'Students Helped' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>StudyBridge - Study Abroad Platform | Find Universities & Scholarships</title>
        <meta
          name="description"
          content="Discover universities, scholarships, and comprehensive guidance for studying abroad. Your complete platform for international education."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 2,
                  }}
                >
                  Your Journey to Study Abroad Starts Here
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                  Discover universities, scholarships, and expert guidance all in one platform.
                  Make your dream of studying abroad a reality.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/universities')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    Explore Universities
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Get Started Free
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/hero-illustration.svg"
                  alt="Study Abroad"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Everything You Need to Study Abroad
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive tools and resources for your international education journey
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: `${feature.color}20`,
                          color: feature.color,
                          mb: 3,
                          mx: 'auto',
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
              Join thousands of students who have successfully applied to their dream universities
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Create Free Account
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;