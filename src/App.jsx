import { useState, useEffect } from "react";

import { io } from "socket.io-client";
import "./App.css";

let socket;

function App() {
  const [socketId, setSocketId] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState({ message: "" });
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:4000");

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

    socket.on("room_joined", (data) => {
      console.log(`${user} has joined the room ${data}.`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server.");
    });

    socket.on("send_message", (data) => console.log(data));

    socket.on("new_user", (data) => {
      console.log(data);
    });

    return () => socket.off();
  }, []);

  function handleCreateUser() {
    socket.emit("create_user", user);
  }

  function handleCreateRoom() {
    socket.emit("create_room", room);
  }

  function handleJoinRoom() {
    socket.emit("join_room", room);
  }

  function handleLeaveRoom(nameRoom) {
    socket.emit("leave_room", nameRoom);
  }

  function handleMessage() {
    socket.emit("send_message", "Hello server!");
  }

  function handleDM() {
    socket.emit("send_message", { message: "Detta är ett PM", to: socketId });
  }

  return (
    <div className="App">
      <header className="App-header">
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

          {/* Join room */}
          <input
            type="text"
            placeholder="enter room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            autoComplete="off"
          />
          <button onClick={handleJoinRoom}>Join a room</button>

          {/* Message */}
          <input
            type="text"
            placeholder="send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <button onClick={handleMessage}>Send message</button>

          {/* <input
            type="text"
            placeholder="send DM"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          <button onClick={handleDM}>Private message</button> */}

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
      </header>
    </div>
  );
}

export default App;

// 1) hur ska jag visa användaren att detta är ett rum 2) databas för rum och meddelanden 3) testa om jag kan joina olika rum 4) när jag skapar ett rum bör man veta vilket rum en joinar (antingen namnet eller id) 5) ska inte kunna skapa rum som redan finns 6) behöver skriva en funktion att deleta ett rum, knapp på frontend 7) när man deletar ett rum så tas alla meddelanden bort i det rummet. 8) hantera meddelanden, som create user fast create message. Rekommenderar att hämta alla meddelanden så att alla i rummet kan se dem. 9) vem har skrivit och vilket tid och vilket rum 10) skapa middleware log som sparar alla meddelanden. 11) göra en funktion på backend som stoppar tomma meddelanden.
