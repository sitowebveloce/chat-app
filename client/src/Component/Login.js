import React from 'react'
// import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import './Login.css';

//
// ─── EPORT FUNCTION ─────────────────────────────────────────────────────────────

export default function Login(props) {

    // Deconstruct props
    const {handleChat, user, setUser, room, setRoom} = props;
    // Styles
    // const classes = useStyles();

    //
    // ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
    const handleSubmit = (e) =>{
        e.preventDefault();
        // If name and room are not empty sho chat
        if(user.length > 0 && room.length > 0){
            handleChat(user, room);
        }

    }

    //
    // ─── RETURN ─────────────────────────────────────────────────────────────────────
    //
    return (
        <div>
           <form className='login-form'  onSubmit={handleSubmit}>
           <TextField 
           id="outlined-basic" 
           label="Username" 
            value={user}
            onChange={(e)=> setUser(e.target.value)}
           variant="outlined" 
           />
           
           <TextField 
           id="outlined-basic" 
           label="Room"
           value={room} 
           onChange ={e => setRoom(e.target.value)}
           variant="outlined"
            />

             <input className='login-btn' type='submit' placeholder='Enter' />
           </form>
        </div>
    )
}
