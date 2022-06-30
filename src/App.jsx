import { useState, useEffect } from "react";

import { io } from "socket.io-client";
import "./App.css";

let socket;

function App() {
  const [socketId, setSocketId] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");

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

  function createRoom() {
    socket.emit("create_room", room);
  }

  function joinRoom() {
    const nameRoom = prompt("What room willt thou liketh to joineth?");
    socket.emit("join_room", nameRoom);
  }

  function leaveRoom(nameRoom) {
    socket.emit("leave_room", nameRoom);
  }

  function messageHandler() {
    socket.emit("send_message", "Hello server!");
  }

  function handleDM() {
    socket.emit("send_message", { message: "Detta är ett PM", to: socketId });
  }

  function handleCreateUser() {
    socket.emit("create_user", user);
  }

  function handleJoinRoom() {
    socket.emit("join_room", room);
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="enter username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            autoComplete="off"
          />
          <button onClick={handleCreateUser}>Create user</button>

          <input
            type="text"
            placeholder="enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
            autoComplete="off"
          />
          <button onClick={createRoom}>Create a room</button>
          <button onClick={handleJoinRoom}>Join a room</button>
          <button onClick={messageHandler}>Send message</button>
          <div>{/* <input type="text">messages</input> */}</div>
          <button onClick={handleDM}>Private message</button>
          <input
            name="socket-id"
            value={socketId}
            onChange={(e) => setSocketId(e.target.value)}
          />
          <button onClick={() => leaveRoom("piri room")}>Leave the room</button>
        </form>
      </header>
    </div>
  );
}

export default App;

// 1) hur ska jag visa användaren att detta är ett rum 2) databas för rum och meddelanden 3) testa om jag kan joina olika rum 4) när jag skapar ett rum bör man veta vilket rum en joinar (antingen namnet eller id) 5) ska inte kunna skapa rum som redan finns 6) behöver skriva en funktion att deleta ett rum, knapp på frontend 7) när man deletar ett rum så tas alla meddelanden bort i det rummet. 8) hantera meddelanden, som create user fast create message. Rekommenderar att hämta alla meddelanden så att alla i rummet kan se dem. 9) vem har skrivit och vilket tid och vilket rum 10) skapa middleware log som sparar alla meddelanden. 11) göra en funktion på backend som stoppar tomma meddelanden.
