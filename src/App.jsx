import { useEffect, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
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
    if (message.trim() === "") return;

    const msgData = { username, text: message };
    socket.emit("send_message", msgData);
    setMessage("");
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div className="login-container">
        <h2>Enter Username</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            if (username.trim() !== "") setLoggedIn(true);
          }}
        >
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">LiveConnect™</div>

      <div className="chat-box">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`chat-message ${
              m.username === username ? "sent" : "received"
            }`}
          >
            {m.username !== username && (
              <span className="chat-username">{m.username}</span>
            )}
            {m.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
}

export default App;
