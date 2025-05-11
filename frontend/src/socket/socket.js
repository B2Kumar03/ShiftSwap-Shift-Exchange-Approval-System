import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

export const useSocket = () => {
  useEffect(() => {
    console.log("Socket.io connection established");

    socket.on("connect", () => {
      console.log("Connected to Socket.io server:", socket.id);
    });

    // Optional: handle disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    return () => {
      socket.disconnect(); // Clean up
    };
  }, []);

  return socket;
};
