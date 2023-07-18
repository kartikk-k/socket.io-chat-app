import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080/room');

function App() {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<{roomId: string, message:string}[]>([]);

  useEffect(() => {
    socket.on('message', (data) => {
      setChats((prevChats) => [...prevChats, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinRoom = () => {
    socket.emit('joinRoom', roomId);
  };

  const sendMessage = () => {
    socket.emit('message', { roomId, message });
    setMessage('');
  };

  return (
    <div>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
      />
      <button onClick={joinRoom}>Join Room</button>
      <br />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter Message"
      />
      <button onClick={sendMessage}>Send Message</button>
      <br />
      <div>
        {chats.map((chat, index) => (
          <p key={index}>{chat.message}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
