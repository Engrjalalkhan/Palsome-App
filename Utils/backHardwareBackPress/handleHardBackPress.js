import React, { createContext, useContext, useEffect, useState } from "react";
import { BackHandler, Alert } from "react-native";

// Context for BackPress behavior
const BackPressContext = createContext();

export const BackPressProvider = ({ children }) => {
  const [handlerStack, setHandlerStack] = useState([]);

  useEffect(() => {
    const onBackPress = () => {
      if (handlerStack.length > 0) {
        const currentHandler = handlerStack[handlerStack.length - 1];
        return currentHandler(); // Call the topmost back handler
      }
      return false; // Default behavior if no handler is present
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [handlerStack]);

  const pushHandler = (handler) => {
    setHandlerStack((prevStack) => [...prevStack, handler]);
  };

  const popHandler = () => {
    setHandlerStack((prevStack) => prevStack.slice(0, -1));
  };

  return (
    <BackPressContext.Provider value={{ pushHandler, popHandler }}>
      {children}
    </BackPressContext.Provider>
  );
};

// Hook for using the custom back press handler
export const useBackHandler = (handler) => {
  const { pushHandler, popHandler } = useContext(BackPressContext);

  useEffect(() => {
    pushHandler(handler);

    return () => popHandler();
  }, []);
};
