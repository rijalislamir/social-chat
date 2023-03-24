import { reactive } from "vue"
import { io } from "socket.io-client"

export const state = reactive<any>({
  connected: false,
  fooEvents: [],
  barEvents: []
});

export const socket = io(
  import.meta.env.VITE_BACKEND_URL,
  { autoConnect: false }
);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});
