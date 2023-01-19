// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Server } from 'socket.io'


function handler(req, res) {
 if(res.socket.server.io){
   console.log('Socket is already running....')
  }else{
     console.log('Socket is initializing....')
     const io=new Server(res.socket.server)
     res.socket.server.io=io

     io.on('connection',(socket)=>{
        
       socket.on('join_room',(data)=>{
          socket.join(data)
          console.log(`${socket.id} joined room ${data}`)
       })

       socket.on('send_message',(data)=>{
          socket.to(data.roomID).emit('recieved_chat',data)
       })

       socket.on('disconnect',()=>{
          console.log(`client ${socket.id} disconnected.....`)
       })

     })
    }
  
res.end()
}



export default handler
  