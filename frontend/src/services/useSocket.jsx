import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = (groupId) => {
  const socket = io("http://localhost:3000", { withCredentials: true });

  useEffect(() => {
    // Join the group room via Socket.io
    socket.emit("joinGroup", groupId);

    return () => {
      socket.disconnect();
    };
  }, [groupId]);

  return socket;
};

export default useSocket;
