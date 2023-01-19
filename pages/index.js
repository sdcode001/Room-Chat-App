import  io  from 'socket.io-client'
import { useEffect, useState} from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
let socket

 function Home() {
  const [userID,setUserID]=useState("")
  const [roomID,setRoomID]=useState("")
  const [currentChat,setCurrChat]=useState("")
  const [showChat,setShowChat]=useState(false)
  const [chats,setChats]=useState([])
  
  useEffect(()=>{
    socketInitializer()
  },[])

 async function sendChat(){
    if(currentChat!=""){
        const chatObj={
            userID:userID,
            roomID:roomID,
            message:currentChat,
            time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()
        }
       await socket.emit('send_message',chatObj)
       setChats((list)=>[...list,chatObj])
       setCurrChat("")
    }
}

  function joinRoom(){
    if(userID!=""&&roomID!=""){
      socket.emit('join_room',roomID)
      setShowChat(true)
    }
  }



  const socketInitializer=async ()=>{
    await fetch('/api/server')
    socket=io()

    socket.on('recieved_chat',(data)=>{
      setChats((list)=>[...list,data])
    })

  
  

  }

  return (
    <div className='App'>
      {!showChat? (
      <div className='joinChatContainer'>
      <h3>Join Room Chat</h3>
      <input type='text' placeholder='User Name' onChange={(event)=>{setUserID(event.target.value)}}/>
      <input type='text' placeholder='Room ID' onChange={(event)=>{setRoomID(event.target.value)}}/>
      <button onClick={joinRoom}>Join A Room</button>
      </div>
      ):
      (
      <div className='chat-window'>
        <div className='chat-header'>
            <p>Live Chat</p>
        </div>
        <div className='chat-body'>
          <ScrollToBottom className="message-container">{
            chats.map((chatContent)=>{
              return( <div className='message' 
                           id={chatContent.userID===userID ? "you": "other"}>
                    <div>
                    <div className='message-content'>
                      <p>{chatContent.message}</p>
                    </div>
                    <div className='message-meta'>
                    <p id="time">{chatContent.time}</p>
                    <p id="author">{chatContent.userID}</p>
                    </div>
                    </div>
              </div>)
            })
           }
        </ScrollToBottom>
        </div>
        <div className='chat-footer'>
            <input 
            type="text" 
            value={currentChat}
            placeholder='message' 
            onChange={(event)=>{setCurrChat(event.target.value)}}
            onKeyPress={(event)=>{
               event.key==="Enter"&& sendChat()
            }}
            />
            <button onClick={sendChat}>&#9658;</button>
        </div>
    </div>
      )}
    </div>
    
  )
}

export default Home
