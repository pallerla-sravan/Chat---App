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
  const [chatRequests, setChatRequests] = useState([]);
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
    const handleMessage = (data) => {
      console.log(`Message received in ${data.roomId}: ${data.mess}`);
      setMessageMap(prevMessages => ({
        ...prevMessages,
        [data.roomId]: [...(prevMessages[data.roomId] || []), { sender: data.sender, text: data.mess }]
      }));
    };
    socket.on('receiveMessage', handleMessage);
    socket.on('receiveChatRequest', (data) => {
      if (data.receiver === currentUser) {
        setChatRequests(prev => [...prev, data]);
      }
    });

    socket.on('chatRequestAccepted', (data) => {
      setRoomId(data.roomId);
    });

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [roomId,currentUser]);

  const handleSubmit = () => {
    if (mess && roomId) {
      socket.emit('sendmessage', { roomId, mess, sender: currentUser });
      setMess(""); 
    } else {
      alert("Please enter both the message and the room ID.");
    }
  };


  const handleChatRequest = (selectedUser) => {

    socket.emit('sendChatRequest', { sender: currentUser, receiver: selectedUser });
  };

  const handleAcceptRequest = (sender) => {
    socket.emit('acceptChatRequest', { sender, receiver: currentUser });
    setChatRequests([])
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

 
  return (
    <div className='h-screen bg-black flex'>
      <div className='w-1/3 bg-gray-900 text-white p-5'>
        <h1><b>Myself</b>: {currentUser}</h1>
        <h1 className='text-xl font-bold mb-4'>Available Users</h1>
        <ul className='space-y-3'>
          {users.length > 0 ? users.map((user, index) => (
            <li key={index}>
              <button
                className='w-full text-left p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all'
                onClick={() => handleChatRequest(user.username)}>
                {user.username}
              </button>
            </li>
          )) : <p className='text-gray-400'>No users available</p>}
          
        </ul>

        <h2 className='text-xl font-bold mb-4 mt-5'>Chat Requests</h2>
        <ul className='space-y-3'>
          {chatRequests.map((req, index) => (
            <li key={index} className='text-gray-400'>
              <div className='flex items-center justify-around'>
              <p className='font-bold'>{req.sender} wants to chat with you</p>
              <button
                onClick={() => handleAcceptRequest(req.sender)}
                className='bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-all'>
                Accept
              </button>
              </div>
            </li>
          ))}

        </ul>
      </div>

      <div className='w-2/3 bg-gradient-to-r from-black to-gray-800  text-white p-5 h-full'>
        <h1 className='text-center mb-4 text-xl font-bold'>Chat with {roomId.split('_').find(user => user !== currentUser) || "No Room Selected"}</h1>

        <div className='mt-5 p-4 bg-gray-800 rounded-lg h-[80%] overflow-y-scroll custom-scrollbar'>
          <h2 className='font-bold text-gray-300 mb-3'>Messages:</h2>
          <ul className='space-y-2 h-full flex flex-col p-2'>
            {(messageMap[roomId] || []).map((message, index) => (
              <li key={index} className={`p-2 rounded-lg shadow ${message.sender === currentUser ? 'bg-gray-700 text-right ml-auto' : 'bg-gray-700 text-left mr-auto'}`}>
                <span className='flex pl-2 pr-2'>{message.text}</span>
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
            className='ml-2 p-2 pl-4 pr-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;








