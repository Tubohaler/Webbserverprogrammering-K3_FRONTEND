import { useState, useEffect } from "react";

import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:4000", { autoConnect: false });
socket.connect();

function App() {
  const [socketId, setSocketId] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [updateRoom, setUpdateRoom] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("user_created", (data) => {
      setUser(data);
      console.log(`User ${data} has been created.`);
    });

    socket.on("room_created", (data) => {
      setRoom(data);
      console.log(`Room ${data} has been created.`);
    });

    socket.on("delete_room", (newRooms) => {
      setRoom("");
      console.log(`Room ${data} has been deleted.`);
    });

    socket.on("join_room", (data) => {
      setMessageHistory(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server.");
    });

    socket.on("send_message", (data) => console.log(data));

    socket.on("new_user", (data) => {});

    return () => socket.off();
  }, []);

  function handleCreateUser() {
    socket.emit("create_user", user);
  }

  function handleCreateRoom() {
    socket.emit("create_room", room);
  }

  function handleDeleteRoom() {
    socket.emit("delete_room", room);
  }

  function handleJoinRoom() {
    socket.emit("join_room", room);
    setUpdateRoom(room);
  }

  function handleLeaveRoom(nameRoom) {
    socket.emit("leave_room", nameRoom);
    setUpdateRoom("");
  }

  function handleMessage(message) {
    socket.emit("send_message", message);
  }

  return (
    <div className="App">
      <header>Tjenixxen chat service</header>
      <section>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Create user */}
          <input
            type="text"
            placeholder="enter username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            autoComplete="off"
          />
          <button onClick={handleCreateUser}>Create user</button>

          {/* Create new room */}
          <input
            type="text"
            placeholder="new room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
            autoComplete="off"
          />
          <button onClick={handleCreateRoom}>Create a New Room</button>

          {/* Delete room */}
          <input
            type="text"
            placeholder="delete room with name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            autoComplete="off"
          />
          <button onClick={handleDeleteRoom}>Delete room</button>

          {/* Join room */}
          <input
            type="text"
            placeholder="enter room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            autoComplete="off"
          />
          <button onClick={handleJoinRoom}>Join a room</button>
        </form>
      </section>
      <section>
        <h1>{updateRoom}</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Message */}
          <input
            type="text"
            placeholder="send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <button onClick={() => handleMessage(message)}>Send message</button>

          {/* Leave room */}
          <input
            name="socket-id"
            value={socketId}
            onChange={(e) => setSocketId(e.target.value)}
          />
          <button onClick={() => handleLeaveRoom("mancave")}>
            Leave the room
          </button>
        </form>
      </section>
      <section>
        <h3> Message Board</h3>
        <div>
          {messageHistory.map((obj) => {
            return (
              <div key={obj.id}>
                <h2>id: {obj.user_id}</h2>
                <h2>room: {obj.room_id}</h2>
                <h2>created_at: {obj.created_at}</h2>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default App;
