import { useEffect, useState } from 'react'
import socket from "./socket";
import './App.css'

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const handleReceive = (msg) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, []);

  const sendMsg = () => {
    if (message.trim() === "") return; // prevent empty messages
    socket.emit("send_message", message);
    setMessage("");
  };

  return (
    <div>
      <h1>Live Chat App</h1>

      <div>
        {chat.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input
        value={message}
        placeholder="Type message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMsg();
          }
        }}
      />
      <button onClick={sendMsg}>Send</button>
    </div>
  );
}

export default App;
