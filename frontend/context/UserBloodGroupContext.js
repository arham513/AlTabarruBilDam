// context/UserBloodGroupContext.js
import React, { createContext, useState } from "react";

export const UserBloodGroupContext = createContext();

export const UserBloodGroupProvider = ({ children }) => {
  const [bloodGroup, setBloodGroup] = useState(null);

  return (
    <UserBloodGroupContext.Provider value={{ bloodGroup, setBloodGroup }}>
      {children}
    </UserBloodGroupContext.Provider>
  );
};
