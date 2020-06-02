import React, { useRef, useState } from "react";

import { useWebrtc } from "./utils/groupCall";
import { RoomsProvider, useRooms } from "./hooks/roomsHooks";

import server from "./configs/server";

const App = () => {
  const video = useRef(null);
  const { joinRoom, leaveRoom, createRoom, releaseRoom, getRooms } = useWebrtc({
    videoRef: video,
    url: server(),
  });
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [rooms] = useRooms();

  return (
    <div>
      <div>
        <video autoPlay width="640px" height="480px" ref={video} />
      </div>
      <div>
        Token:
        <input value={token} onChange={(e) => setToken(e.target.value)} />
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <div onClick={() => joinRoom({ token, name })}>Join Room</div>
        <div onClick={() => leaveRoom()}>Leave Room</div>
        <br />
        <br />
        <br />
        <br />
        <div onClick={() => createRoom()}>Create Room</div>
        <br />
        <div onClick={() => getRooms()}>Get Rooms</div>
        {rooms.map((room) => (
          <div key={room.id}>
            Room: {room.id}
            <br />
            Tokens: <br />
            {Object.keys(room.tokens).map((token) =>
              token === "length" ? null : <div key={token}>{token}</div>
            )}
            <div onClick={() => releaseRoom(room.id)}>Release Room</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default () => {
  const [rooms, setRooms] = useState([]);

  return (
    <RoomsProvider rooms={rooms} setRooms={setRooms}>
      <App />
    </RoomsProvider>
  );
};
