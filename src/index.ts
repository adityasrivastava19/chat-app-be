import {WebSocketServer,WebSocket} from "ws";
const wss=new WebSocketServer({port:8080});
console.log("server is live");
interface user{
    socket:WebSocket;
    room:string;
}
let alluser:user[]=[];
wss.on("connection",function(socket)
{   
   socket.on("message",(message)=>{
    const parsemessage=JSON.parse(message.toString());
    // logic to join the room 
    if(parsemessage.type==="join")
    {
        alluser.push({
            socket,
            room:parsemessage.payload.roomId
        })
        socket.send("joined room");
    }
   
    // logic to send the message to the room
    if(parsemessage.type==="chat")
    {
       
        //sreaching current room 
        const currentRoom=alluser.find(x=>x.socket===socket)?.room;
        if (currentRoom) {
           
            for (let i=0;i<alluser.length;i++)
            {
               
                if(alluser[i]?.room===currentRoom)
                {
                    
                    alluser[i]?.socket.send(parsemessage.payload.message);
                }
            }
        }
    }
   })
        socket.on("close", () => {
        alluser = alluser.filter(x => x.socket !== socket);
                 });
})


