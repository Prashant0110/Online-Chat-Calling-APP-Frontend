// Example of useSocket hook managing the socket connection
const useSocket = (selectedGroupId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io("http://localhost:3000");

    socketConnection.on("connect", () => {
      socketConnection.emit("joinGroup", selectedGroupId);
    });

    socketConnection.on("message", (message) => {
      // Handle incoming message
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [selectedGroupId]);

  return socket;
};

export default useSocket;
