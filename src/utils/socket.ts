import { io } from 'socket.io-client';
import { getBackendURL } from './env';

const URL = getBackendURL();

export const socket = io(URL, { autoConnect: false });

export const connectSocket = (userId: string, name: string, email: string) => {
  socket.auth = {
    userId,
    name,
    email,
  };
  socket.connect();
};

if (import.meta.env.DEV) {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
}
