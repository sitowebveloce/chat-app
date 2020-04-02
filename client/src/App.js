import React from 'react';
import './App.css';
import Login from './Component/Login';
import Chat from './Component/Chat';

function App() {
  //
  // ─── STATE ──────────────────────────────────────────────────────────────────────
  const [chat, setChat] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [room, setRoom] = React.useState('');
  const [city, setCity] = React.useState('');

  // Handle Chat
  const handleChat = (user, room)=>{
    // Set state user and room
    setUser(user);
    // Show Chat window
    setChat(!chat)
  }

  //
  // ─── RETURN ─────────────────────────────────────────────────────────────────────
  
  return (
    <div className="App">
      <h1 className='chat-title'> <span role='img'  aria-label='chat'>💬</span> Chat App</h1>
     {chat ? <a className='chat-exit-btn' href='/'>Exit</a> : null} 
     {chat ? null : <Login 
     handleChat={handleChat} 
     user={user} 
     room={room}
     setUser={setUser}
     setRoom={setRoom}
     />}
      {chat ? <Chat 
      username={user} 
      room = {room}
      city={city}
      setCity={setCity}
      /> : null }
    </div>
  );
}

export default App;
