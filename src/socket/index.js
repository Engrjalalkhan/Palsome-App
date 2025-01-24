import React, { createContext, useContext, useEffect, useState } from "react";

import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { useSelector } from "react-redux";
import { SITE_URL, SOCKET_URL } from "../Services/Constants";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const APP_KEY = "cguOYexsaZnp5lPyHymxOPnF";
  const token = useSelector((state) => state?.auth?.userToken);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      Pusher.logToConsole = false;
      const PusherClient = new Pusher(APP_KEY, {
        cluster: "mt1",
        wsHost: SOCKET_URL,
        wsPort: 6001,
        wssPort: 6001,
        enabledTransports: ["ws", "wss"],
        forceTLS: true,
        authEndpoint: `${SITE_URL}broadcasting/auth`,
        auth: {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      });

      const echo = new Echo({
        broadcaster: "pusher",
        client: PusherClient,
      });

      setSocket(echo);

      return () => {
        echo.disconnect();
      };
    }
  }, [token]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
