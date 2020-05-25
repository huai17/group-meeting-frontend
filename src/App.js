import React, { useRef, useState } from "react";

import { useWebrtc } from "./utils/groupCall";
import { RoomProvider, useRoom } from "./hooks/roomHooks";

const App = () => {
  const video = useRef(null);
  const [joinRoom, leaveRoom, createRoom, releaseRoom] = useWebrtc({
    videoRef: video,
  });
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [room] = useRoom();

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
        {room.id ? (
          <div onClick={() => releaseRoom(room.id)}>Release Room</div>
        ) : (
          <div onClick={() => createRoom()}>Create Room</div>
        )}
        Room: {room.id}
        <br />
        Tokens: <br />
        {Object.keys(room.tokens).map((token) =>
          token === "length" ? null : <div key={token}>{token}</div>
        )}
      </div>
    </div>
  );
};

export default () => {
  const [room, setRoom] = useState({ id: "", tokens: {} });

  return (
    <RoomProvider room={room} setRoom={setRoom}>
      <App />
    </RoomProvider>
  );
};
