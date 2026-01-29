import { useEffect, useState } from "react";
import socket from "./socket";
import "./App.css";
import AppLogoImg from "./AppLogo.jpeg";

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
    if (!message.trim()) return;

    socket.emit("send_message", {
      username,
      text: message,
    });

    setMessage("");
  };

  const joinChat = () => {
    if (!username.trim()) return;
    setLoggedIn(true);
  };

  /* 🔐 LOGIN SCREEN (ENTER KEY FIXED — NO FORM) */
  if (!loggedIn) {
    return (
      <div className="login-container">
        <div className="user-header">LiveConnect™</div>
        <img src={AppLogoImg} alt="image"  />
        <h2>Enter Username</h2>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              joinChat();
            }
          }}
          autoFocus
        />

        <button onClick={joinChat}>Join Chat</button>
      </div>
    );
  }

  /* 💬 CHAT SCREEN */
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
