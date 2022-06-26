import { useState, useEffect } from "react";

import { io } from "socket.io-client";
import "./App.css";

let socket;

function App() {
  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("send-message", (data) => console.log(data));

    return () => socket.off();
  }, []);

  function messageHandler() {
    socket.emit("send-message", "Hello server!");
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={messageHandler}>Send message</button>
      </header>
    </div>
  );
}

export default App;
