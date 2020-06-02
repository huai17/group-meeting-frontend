import React, { createContext, useContext } from "react";
export const RoomsContext = createContext();
export const RoomsProvider = ({ children, rooms, setRooms }) => (
  <RoomsContext.Provider value={[rooms, setRooms]}>
    {children}
  </RoomsContext.Provider>
);
export const useRooms = () => useContext(RoomsContext);
