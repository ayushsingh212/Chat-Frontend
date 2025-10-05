import { useEffect, useState } from "react";
import { getRooms, API_URL } from "../api/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Rooms() {
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchRooms();
    };

    fetchData();
  }, []); // Removed unnecessary navigate dependency

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      console.log("here is the rooms", res);
      setRooms(res.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  if (!name.trim()) return;

  try {
    console.log("Creating room with name:", name);
    
    // Make sure you're sending credentials
    const res = await axios.post(
      `${API_URL}/room/createRoom`,
      { name },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log("Room created:", res.data);
    setName("");
    await fetchRooms();
  } catch (error: any) {
    console.error("Full error object:", error);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      if (error.response.status === 401) {
        console.error("Unauthorized - check JWT token");
      }
    } else if (error.request) {
      console.error("No response received. Request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div>
      <div>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Room name" 
        />
        <button onClick={handleCreate}>Create Room</button>
      </div>

      <ul>
        {rooms.map((room) => (
          <li 
            key={room._id} 
            onClick={() => handleRoomClick(room._id)}
            style={{ cursor: "pointer", padding: "8px", margin: "4px 0" }}
          >
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
}