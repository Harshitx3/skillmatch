import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const newSocket = io("http://localhost:5000", {
            auth: { token }
        });

        newSocket.on("connect", () => {
            console.log("🔌 Socket connected");
        });

        newSocket.on("disconnect", () => {
            console.log("🔌 Socket disconnected");
        });

        newSocket.on("new_like", (data) => {
            console.log("🔔 New like received:", data);
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const clearNotifications = () => {
        setUnreadCount(0);
    };

    const markAsRead = () => {
        setUnreadCount(0);
    };

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, clearNotifications, markAsRead }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
