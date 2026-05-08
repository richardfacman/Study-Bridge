import { io } from 'socket.io-client';
import useUIStore from '@/store/uiStore';
import { toast } from 'react-toastify';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('notification', (data) => {
    useUIStore.getState().addNotification(data);
    
    // Show toast notification
    toast.info(data.message, {
      onClick: () => {
        if (data.actionUrl) {
          window.location.href = data.actionUrl;
        }
      },
    });
  });

  socket.on('application_update', (data) => {
    toast.success(`Application status updated: ${data.status}`);
  });

  socket.on('deadline_reminder', (data) => {
    toast.warning(data.message, {
      autoClose: 8000,
    });
  });

  socket.on('scholarship_alert', (data) => {
    toast.info(data.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
};