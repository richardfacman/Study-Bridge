import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import useAuthStore from '@/store/authStore';
import { formatDate } from '@/utils/formatters';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      nationality: user?.nationality || '',
      dateOfBirth: user?.dateOfBirth || '',
      currentCountry: user?.currentCountry || '',
      educationLevel: user?.educationLevel || '',
      studyLevel: user?.studyLevel || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // await userService.updateProfile(data);
      updateUser(data);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      // await userService.uploadProfilePicture(file);
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    reset();
    setEditMode(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile - StudyBridge</title>
      </Helmet>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>
            My Profile
          </Typography>
          {!editMode && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Profile Picture */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    src={user?.profilePicture}
                    sx={{ width: 150, height: 150, mx: 'auto' }}
                  />
                  {editMode && (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                      disabled={uploadingPhoto}
                    >
                      <PhotoCameraIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Chip
                  label={user?.isEmailVerified ? 'Verified' : 'Unverified'}
                  color={user?.isEmailVerified ? 'success' : 'warning'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Account Stats
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Member Since</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(user?.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Last Login</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(user?.lastLogin)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Profile Completeness</Typography>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    75%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            disabled={!editMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            fullWidth
                            disabled={!editMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            disabled
                            helperText="Email cannot be changed"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone Number"
                            fullWidth
                            disabled={!editMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Nationality"
                            fullWidth
                            disabled={!editMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="currentCountry"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Current Country"
                            fullWidth
                            disabled={!editMode}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="educationLevel"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth disabled={!editMode}>
                            <InputLabel>Education Level</InputLabel>
                            <Select {...field}>
                              <MenuItem value="High School">High School</MenuItem>
                              <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                              <MenuItem value="Graduate">Graduate</MenuItem>
                              <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                              <MenuItem value="PhD">PhD</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="studyLevel"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth disabled={!editMode}>
                            <InputLabel>Interested Study Level</InputLabel>
                            <Select {...field}>
                              <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                              <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                              <MenuItem value="PhD">PhD</MenuItem>
                              <MenuItem value="Diploma">Diploma</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>

                  {editMode && (
                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        fullWidth
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        fullWidth
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;