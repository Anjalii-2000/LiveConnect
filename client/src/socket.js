import { io } from "socket.io-client";

const socket = io("https://liveconnect-server.onrender.com");

// enable below line for local debugging
//const socket = io("http://localhost:5000"); // backend URL

export default socket;
