import React, { createContext, useContext } from "react";
export const RoomContext = createContext();
export const RoomProvider = ({ children, room, setRoom }) => (
  <RoomContext.Provider value={[room, setRoom]}>
    {children}
  </RoomContext.Provider>
);
export const useRoom = () => useContext(RoomContext);
