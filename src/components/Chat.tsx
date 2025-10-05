import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../api/api"; // Import the new function

interface IUser {
  _id: string;
  fullName: string;
  email: string;
}

interface IMessage {
  _id: string;
  sender: IUser;
  message: string;
  createdAt: string;
  roomId: string;
}

export default function Chat() {
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // ✅ Fetch user only once
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/getUser`, {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (error) {
        console.log("Something went wrong while getting the user", error);
      }
    };
    getCurrentUser();
  }, []);

  // ✅ Fetch existing messages when roomId changes
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/message/messages/${roomId}`,{
          withCredentials:true
        });
        console.log("📨 Existing messages:", res.data.data);
        setMessages(res.data.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !user) return;

    const SOCKET_URL = API_URL.replace('/api', '');
    console.log("Connecting to Socket.IO:", SOCKET_URL);

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
      socket.emit("joinRoom", roomId);
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error);
    });

    socket.on("receiveMessage", (newMessage: IMessage) => {
      console.log("📨 Received new message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.disconnect();
    };
  }, [roomId, user]);

  const sendMessage = () => {
    if (!message.trim() || !user || !socketRef.current) {
      console.log("Cannot send message");
      return;
    }

    const messageData = {
      roomId,
      message: message.trim(),
      sender: user._id,
    };

    console.log("📤 Sending message:", messageData);
    socketRef.current.emit("sendMessage", messageData);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat Room: {roomId}</h2>
      <div>User: {user?.fullName}</div>
      
      {/* Message Count */}
      <div style={{ margin: "10px 0", color: "#666" }}>
        {messages.length} message{messages.length !== 1 ? 's' : ''}
      </div>
      
      {/* Messages Container */}
      <div 
        style={{ 
          maxHeight: "400px", 
          overflowY: "auto", 
          border: "1px solid #ccc", 
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "black"
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "red" }}>
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id} 
              style={{ 
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: message.sender.fullName === user?.fullName? "blue" : "green",
                borderRadius: "8px",
                border: "1px solid #e0e0e0"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ color: message.sender.fullName === user?.fullName? "#1976d2" : "#333" }}>
                  {/* {message.sender === user?._id ? "You" : "User"}
                   */}
                   {message.sender.fullName}
                </b>
                <small style={{ color: "#666" }}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </small>
              </div>
              <div style={{ marginTop: "4px" }}>{message.message}</div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ 
            flex: 1,
            padding: "10px", 
            marginRight: "8px", 
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={!message.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: message.trim() ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: message.trim() ? "pointer" : "not-allowed",
            fontSize: "16px"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}