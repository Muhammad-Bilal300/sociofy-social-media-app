// socket.ts
import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      // origin: "*", // adjust this for your frontend
      origin: "https://sociofy.site",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });
  return io;
};

export const getSocket = () => io;
