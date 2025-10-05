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
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
       await axios.post(
        `${API_URL}/room/createRoom`,
        { name },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setName("");
      await fetchRooms();
    } catch (error: any) {
      console.error("Error creating room:", error);
      if (error.response?.status === 401) {
        alert("Unauthorized - please login again");
      }
    }
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chat Rooms</h1>

      <div className="w-full max-w-md flex mb-6 space-x-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new room name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
        >
          Create
        </button>
      </div>

      <ul className="w-full max-w-md space-y-2">
        {rooms.length === 0 ? (
          <li className="text-center text-gray-500 py-4 bg-white rounded-md shadow-sm">
            No rooms yet. Create one!
          </li>
        ) : (
          rooms.map((room) => (
            <li
              key={room._id}
              onClick={() => handleRoomClick(room._id)}
              className="cursor-pointer p-4 bg-white rounded-md shadow hover:bg-blue-50 transition-colors duration-200 flex justify-between items-center"
            >
              <span className="text-gray-800 font-medium">{room.name}</span>
              <span className="text-gray-400 text-sm">Enter →</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
