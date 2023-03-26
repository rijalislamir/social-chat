import { io } from "socket.io-client"
import { getBackendURL } from "./utils/env";

const URL = getBackendURL()

export const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  if (import.meta.env.DEV) console.log(event, args);
});
