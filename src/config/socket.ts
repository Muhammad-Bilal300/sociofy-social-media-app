// socket.ts
import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      // origin: "*", // adjust this for your frontend

      origin: "https://sociofy.site", // or "*" during development
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });
  return io;
};

export const getSocket = () => io;
