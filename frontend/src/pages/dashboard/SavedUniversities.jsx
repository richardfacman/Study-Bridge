import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Rating,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  BookmarkRemove as RemoveIcon,
  LocationOn as LocationIcon,
  TrendingUp as RankingIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { formatCurrency } from '@/utils/formatters';

const SavedUniversities = () => {
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState([]);

  // Mock data - replace with actual API call
  const savedUniversities = [
    {
      _id: '1',
      name: 'Harvard University',
      slug: 'harvard-university',
      city: 'Cambridge',
      country: 'USA',
      logo: '/logos/harvard.png',
      coverImage: '/covers/harvard.jpg',
      averageRating: 4.8,
      reviewCount: 1250,
      universityType: 'Private',
      rankings: { qsRanking: { world: 1 } },
      tuitionFees: {
        undergraduate: {
          international: { amount: 54000, currency: 'USD' },
        },
      },
    },
  ];

  const handleRemove = async (universityId) => {
    try {
      // await universityService.unsave(universityId);
      setSavedIds(savedIds.filter((id) => id !== universityId));
      toast.success('University removed from saved list');
    } catch (error) {
      toast.error('Failed to remove university');
    }
  };

  return (
    <>
      <Helmet>
        <title>Saved Universities - StudyBridge</title>
      </Helmet>

      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Saved Universities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Universities you've bookmarked for later
          </Typography>
        </Box>

        {savedUniversities.length > 0 ? (
          <Grid container spacing={3}>
            {savedUniversities.map((uni) => (
              <Grid item xs={12} sm={6} md={4} key={uni._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      zIndex: 1,
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                    }}
                    onClick={() => handleRemove(uni._id)}
                  >
                    <RemoveIcon color="error" />
                  </IconButton>
                  <CardMedia
                    component="img"
                    height="200"
                    image={uni.coverImage}
                    alt={uni.name}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/universities/${uni.slug}`)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                      }}
                      onClick={() => navigate(`/universities/${uni.slug}`)}
                    >
                      {uni.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {uni.city}, {uni.country}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={uni.averageRating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({uni.reviewCount})
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {uni.rankings?.qsRanking?.world && (
                        <Chip
                          icon={<RankingIcon />}
                          label={`#${uni.rankings.qsRanking.world}`}
                          size="small"
                          color="primary"
                        />
                      )}
                      <Chip label={uni.universityType} size="small" variant="outlined" />
                    </Stack>
                    {uni.tuitionFees?.undergraduate?.international?.amount && (
                      <Typography variant="body2" color="text.secondary">
                        From{' '}
                        <Typography component="span" fontWeight={700} color="text.primary">
                          {formatCurrency(
                            uni.tuitionFees.undergraduate.international.amount,
                            uni.tuitionFees.undergraduate.international.currency
                          )}
                        </Typography>
                        /year
                      </Typography>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/universities/${uni.slug}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                No saved universities yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Start exploring universities and save your favorites
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/universities')}
              >
                Browse Universities
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default SavedUniversities;