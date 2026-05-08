import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/formatters';

const UserManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock data
  const users = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'student',
      isEmailVerified: true,
      isSuspended: false,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
  ];

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleSuspend = async () => {
    try {
      // await adminService.suspendUser(selectedUser._id, suspendReason);
      toast.success('User suspended successfully');
      setSuspendDialogOpen(false);
      setSuspendReason('');
    } catch (error) {
      toast.error('Failed to suspend user');
    }
    handleMenuClose();
  };

  const handleVerify = async () => {
    try {
      // await adminService.verifyUser(selectedUser._id);
      toast.success('User verified successfully');
    } catch (error) {
      toast.error('Failed to verify user');
    }
    handleMenuClose();
  };

  return (
    <>
      <Helmet>
        <title>User Management - Admin</title>
      </Helmet>

      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          User Management
        </Typography>

        {/* Search and Filters */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Role</InputLabel>
              <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* Users Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{user.firstName[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'admin' ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {user.isEmailVerified && (
                          <Chip label="Verified" size="small" color="success" />
                        )}
                        {user.isSuspended && (
                          <Chip label="Suspended" size="small" color="error" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleVerify}>
            <VerifyIcon sx={{ mr: 1 }} fontSize="small" />
            Verify User
          </MenuItem>
          <MenuItem onClick={() => setSuspendDialogOpen(true)}>
            <BlockIcon sx={{ mr: 1 }} fontSize="small" />
            Suspend User
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit Role
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete User
          </MenuItem>
        </Menu>

        {/* Suspend Dialog */}
        <Dialog
          open={suspendDialogOpen}
          onClose={() => setSuspendDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Suspend User</DialogTitle>
          <DialogContent>
            <TextField
              label="Reason for suspension"
              multiline
              rows={4}
              fullWidth
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSuspend} variant="contained" color="error">
              Suspend
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default UserManagement;