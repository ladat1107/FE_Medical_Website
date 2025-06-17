import { io } from "socket.io-client";
import { BACKEND_URL } from "@/constant/environment";

// Create the socket instance
const socket = io(BACKEND_URL, {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: false // Start with autoConnect false
});

// Set up basic listeners
socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from socket server:', reason);
  // Only try to reconnect if this wasn't an intentional disconnect
  if (reason === 'io server disconnect') {
    // Server closed the connection, try to reconnect
    socket.connect();
  }
});

// Authenticate socket with a token
export const authenticateSocket = (token) => {
  if (socket && token) {
    socket.emit('authenticate', token);
  }
};

// Get socket instance
export const getSocket = () => {
  return socket;
};

// Connect socket with current auth state
export const connectSocket = (token) => {
  if (!socket.connected) {
    socket.connect();

    // Wait for connection before trying to authenticate
    socket.on('connect', () => {
      if (token) {
        authenticateSocket(token);
      }
    });
  } else if (token) {
    // If already connected but need to authenticate
    authenticateSocket(token);
  }
};

// Disconnect socket gracefully
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;