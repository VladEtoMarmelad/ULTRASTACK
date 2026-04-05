"use client";

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { TechUI } from "../TechUI";

// Define interfaces for the data received from the gateway
interface ServerMetrics {
  cpu: number;
  memory: number;
  timestamp: string;
}

interface Notification {
  type: string;
  message: string;
  timestamp?: string;
}

export const WebsocketTech = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pongResponse, setPongResponse] = useState<any>(null);
  const [roomMessages, setRoomMessages] = useState<string[]>([]);
  
  // Input states
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection to the NestJS gateway
    // Ensure the URL matches your NestJS server port
    const socket = io('http://localhost:3030');
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for real-time metrics broadcasted every 3 seconds
    socket.on('server-metrics', (data: ServerMetrics) => {
      setMetrics(data);
    });

    // Listen for general notifications (welcome or global alerts)
    socket.on('notification', (data: Notification) => {
      setNotifications((prev) => [data, ...prev].slice(0, 5));
    });

    // Listen for responses to the 'ping' event
    socket.on('pong', (data: any) => {
      setPongResponse(data);
    });

    // Listen for room-specific notifications and messages
    socket.on('room-notification', (msg: string) => {
      setRoomMessages((prev) => [...prev, `[System]: ${msg}`]);
    });

    socket.on('new-room-message', (msg: string) => {
      setRoomMessages((prev) => [...prev, `[User]: ${msg}`]);
    });

    // Cleanup connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendPing = () => {
    socketRef.current?.emit('ping', { clientTime: new Date().toISOString() });
  };

  const joinRoom = () => {
    if (roomName) {
      socketRef.current?.emit('join-room', roomName);
    }
  };

  const sendMessageToRoom = () => {
    if (roomName && message) {
      socketRef.current?.emit('message-to-room', { room: roomName, message });
      setMessage("");
    }
  };

  return (
    <>
      <TechUI.H3>Connection Status</TechUI.H3>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Connected to Gateway' : 'Disconnected'}</span>
      </div>

      <TechUI.H3>Live Server Metrics (Broadcast)</TechUI.H3>
      <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 mb-4">
        {metrics ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500">CPU Usage</p>
              <p className="text-xl font-mono">{metrics.cpu.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Memory Usage</p>
              <p className="text-xl font-mono">{metrics.memory.toFixed(2)}%</p>
            </div>
            <p className="col-span-2 text-[10px] text-zinc-400">Last update: {metrics.timestamp}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">Waiting for metrics...</p>
        )}
      </div>

      <TechUI.H3>Interactive Ping-Pong</TechUI.H3>
      <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 mb-4">
        <button 
          onClick={sendPing}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
        >
          Send Ping to Server
        </button>
        {pongResponse && (
          <pre className="mt-4 p-2 bg-black text-purple-400 text-xs overflow-auto rounded border border-zinc-700">
            {JSON.stringify(pongResponse, null, 2)}
          </pre>
        )}
      </div>

      <TechUI.H3>Room Management & Chat</TechUI.H3>
      <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 mb-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm"
          />
          <button 
            onClick={joinRoom}
            className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-800 transition-colors text-sm"
          >
            Join
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm"
          />
          <button 
            onClick={sendMessageToRoom}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Send
          </button>
        </div>

        <div className="mt-2 h-32 overflow-y-auto p-2 bg-white dark:bg-zinc-800 border rounded text-xs font-mono">
          {roomMessages.length === 0 && <span className="text-zinc-500 italic">No messages in room</span>}
          {roomMessages.map((msg, i) => (
            <div key={i} className="mb-1">{msg}</div>
          ))}
        </div>
      </div>

      <TechUI.H3>Notifications Log</TechUI.H3>
      <div className="space-y-2">
        {notifications.map((note, index) => (
          <div key={index} className="p-2 text-xs border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <span className="font-bold">[{note.type}]</span> {note.message}
          </div>
        ))}
      </div>
    </>
  );
};