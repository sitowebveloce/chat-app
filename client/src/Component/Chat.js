//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────

import React from 'react'
import './Chat.css';
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from 'glamor';

//─────────── Create socket.io and connect to the server 
import openSocket from 'socket.io-client'; 
const socket = openSocket('localhost:3001');
//───────────

//─────────── SCROLL
const ROOT_CSS = css({
  height: 300,
  // width: 400
});

//
// ─── RFC ────────────────────────────────────────────────────────────────────────

export default function Chat(props) {
    //
    // ─── STATE ───────────────────────────────────────────────────────
   
    const [msg, setMsg] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [message, setMessage] = React.useState({});
    const [messages, setMessages] = React.useState([]);
    const [alert, setAlert] = React.useState(true);
    const [country, setCountry] = React.useState('it');
    
    //─────────── Deconstruct
    const {username, room, city, setCity} = props;
    //─────────── Style
    // const classes = useStyles();

    //─────────── USEREF TO SELECT ELEMENTS
    const inputMsg = React.useRef();
    
  //
  // ─── GEOLOCALIZATION ────────────────────────────────────────────────
  const funcFetch = async () => {
    let url = 'http://geoplugin.net/json.gp'
    let fetch = await axios.get(url);
    let response = fetch.data;
    // console.log(response.geoplugin_regionName)
    // console.log(response.geoplugin_countryCode)
    setCity(response.geoplugin_regionName);
    setCountry(response.geoplugin_countryCode);
    };

  //─────────────── Nation flag ──────────────────────────────────────────
  const nationFlag = ()=>{
    let url = `https://www.countryflags.io/${country}/flat/64.png`;
    // console.log(url)
    return url
  };

    //───────── USEREFFECT SOCKET EVENTS ─────────────────────────────────
    React.useEffect(()=>{
    // Fetch Geolocation info
    funcFetch();
    // ─── ON SINGLE MESSAGE ─────────────────────────────────────────────
    socket.emit('joinRoom', {username, room});
    // Users in the room
    socket.on('roomUsers', ({room, users})=>{
        // Set users
        setUsers(users);  
    });
    // ─── ON SINGLE MESSAGE EVENT ───────────────────────────────────────
    socket.on('message', message => {
        // console.log(message)
        setAlert(true);
        // Set message
        setMessage(message);
    });
     
    //  ─── ALL MESSAGES EVENT ───────────────────────────────────────

   socket.on('messages', messages => {
      // console.log(message)
      // Set message
      setMessages(messages);
  });
    // ─── TYPING EVENT LISTENER ───────────────────────────────────────
    if(inputMsg.current !== undefined){
      inputMsg.current.addEventListener('keypress', ()=>{
        socket.emit('typing', {username, room});
      });
    }
   
},[]); // Avoid infinite loop

   //────── Set users
   let showUsers = users.map(u=> {
   return (`🧑 ${u.username}`)
   }).join(' \n ');
   // Show single message
   let showMsg = ()=>{
    setTimeout(()=>{
     setAlert(false)
     }, 5000)
    //
     return (
      <>
    <p className="message">{message.user} <span className="chat-time">{message.time}</span></p>
    <p className="text">
        {message.text}	
    </p>
  </>       
     )
   }
  
   //───────── Show message
   let showMsgs = messages.map((m)=> {
    return (
    <div key={uuidv4()} className='div-messages'>
    <p className="messages">{m.user} <span className="chat-time">{m.time}</span></p>
    <p className="text">
        {m.text}	
    </p>
    </div>
        )
    });

   //──────────── Handle Submit
   const handleSubmit = (e)=>{
       e.preventDefault();
       // Emit message
       socket.emit('chatMessage', msg);
       // Clear input
       setMsg('');
       // Scroll dows
       // Focus on the input
   }

    //
    // ─── RETURN ─────────────────────────────────────────────────────────────────────
    return (
        <div className='chat-content'>

    <div className="chat-left">
       <div> <h3>Room: </h3> {room} </div>
       <div> <h3>User: </h3> <span className='chat-users'> {showUsers}</span>  </div> 
       <div> <h3>City: </h3><span role="img"> {city}</span></div> 
       <div> <h3>Flag: </h3><img className='chat-flag' src={nationFlag()} alt='flag' /></div> 
       </div>  

        <div className="chat-right">
       
         {
          alert ? 
          (
          <div className='div-message'>
              {showMsg()} 
          </div>
          )
          : 
          (
           <div className='div-message hide'> 
           </div>
          )
         }
       
        <ScrollToBottom className={ ROOT_CSS }>
       
        <div className='chat-messages'>
         {
           showMsgs
         }
        </div>
        </ScrollToBottom>
        <div className="chat-input-msg">
        <form onSubmit={handleSubmit}>
        <TextField
          ref={inputMsg}
          className='input-msg'
          id="standard-full-width"
          label=""
          style={{ margin: 8 }}
          placeholder={`${username} do you feel happy?`}
          helperText={`${username} insert a message.`}
          fullWidth
          value={msg}
          onChange={e => setMsg(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        //   variant="filled"
        />
            </form>

        </div>
        
        </div>
      
        </div>
    )
}
