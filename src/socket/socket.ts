// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (userId: string) => {
  if (!socket) {
    // socket = io("http://localhost:8080", {
    socket = io("https://sociofy.site", {
      query: { userId }, // send userId so server can join room
      transports: ["websocket"],
    });
  }
  return socket;
};

export const getSocket = (): Socket => socket;
