import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from '@/constant/environment';

const sockets = {};
const useSocket = (namespace = "") => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!namespace) return;

        const socketNamespace = namespace ? `${BASE_URL}/${namespace}` : BASE_URL;

        // Create socket if it doesn't exist for this namespace
        if (!sockets[namespace]) {
            console.log(`Creating new socket connection to ${socketNamespace}`);

            const newSocket = io(socketNamespace, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                autoConnect: true
            });

            sockets[namespace] = newSocket;
        }

        setSocket(sockets[namespace]);

        return () => {
            // Don't close socket on component unmount to allow reuse
            // Only disconnect when app is closing
        };
    }, [namespace]);

    return socket;
};

export default useSocket;
