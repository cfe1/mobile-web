import { createContext, useContext } from "react";
import React from "react";

export const FacilityContext = createContext(null);

export const FacilityProvider = ({ children, value }) => {
  return (
    <FacilityContext.Provider value={value}>
      {children}
    </FacilityContext.Provider>
  );
};

export const useFacilityContext = () => {
  return useContext(FacilityContext);
};
