import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../App.css';
import axios from 'axios';

const socket = io("http://localhost:3000");

function Chat() {
  const [mess, setMess] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messageMap, setMessageMap] = useState({});
  const [users, setUsers] = useState([]);
  const currentUser = sessionStorage.getItem('username') || 'Anonymous';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/users');
        const filterUsers = response.data.users.filter(user => user.username !== currentUser);
        setUsers(filterUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  

  useEffect(() => {
  
    if(roomId){
      socket.emit('joinRoom',roomId)
    }
    const handleMessage = (data) => {
      console.log("inside from handke")
      console.log(`Message received to ${data.roomId} and the message is ${data.mess}`);
      setMessageMap(prevMessages => ({
        ...prevMessages,
        [data.roomId]: [...(prevMessages[data.roomId] || []), { sender: data.roomId, text: data.mess }]
      }));
     };
    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [roomId]);
  

  const handleSubmit = () => {
    if (mess && roomId) {
      socket.emit('sendmessage', { roomId, mess });
      setMess("");
    } else {
      alert("Please enter both the message and the room ID.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='h-screen bg-black flex'>
      <div className='w-1/3 bg-gray-800 text-white p-5'>
        <h1>{sessionStorage.getItem('username')}</h1>
        <h1 className='text-xl font-bold mb-4'>Available Users</h1>
        <ul className='space-y-3'>
          {users.length > 0 ? users.map((user, index) => (
            <li key={index}>
              <button
                className='w-full text-left p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all'
                onClick={() => setRoomId(user.username)}>
                {user.username}
                {messageMap[user.username]?.length > 0 && (
                  <span className="ml-2 text-sm text-gray-400">({messageMap[user.username]?.length} messages)</span>
                )}
              </button>
            </li>
          )) : <p className='text-gray-400'>No users available</p>}
        </ul>
      </div>

      <div className='w-2/3 bg-gray-900 text-white p-5 h-full'>
        <h1 className='text-center mb-4 text-xl font-bold'>Chat with {roomId || "No Room Selected"}</h1>

        <div className='mt-5 p-4 bg-gray-800 rounded-lg h-[80%] overflow-y-scroll custom-scrollbar'>
          <h2 className='font-bold text-gray-300 mb-3'>Messages:</h2>
          <ul className='space-y-2 h-full'>
            {(messageMap[roomId] || []).map((message, index) => (
              <li key={index} className={`p-2 rounded-lg shadow ${message.sender === currentUser ? 'bg-blue-400 text-right' : 'bg-gray-700 text-left'}`}>
                <span>{message.sender}: {message.text}</span>
              </li>
            ))}
            {!messageMap[roomId]?.length && <li className='text-gray-500'>No messages yet</li>}
          </ul>
        </div>

        <div className='flex items-center mt-4 h-[10%]'>
          <input
            type="text"
            value={mess}
            onChange={(e) => setMess(e.target.value)}
            placeholder='Enter your message'
            className='w-full border-2 border-gray-700 rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            onKeyDown={handleKeyPress}
            required
          />
          <button
            onClick={handleSubmit}
            className='ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
