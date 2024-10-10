import  express  from "express";
import {Server}  from "socket.io"
import {createServer} from "http"

import { connectDB } from "./utils/features.js";
import dotenv, { configDotenv } from "dotenv"
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from 'cookie-parser'

import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import { createGroupChats, createMessagesInAChat, createSingleChats, createUser } from "./seeders/user.js";
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/event.js";
import {v4 as uuid} from "uuid"
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import { corsOption } from "./constants/config.js";
import { socketAuth } from "./middlewares/auth.js";




dotenv.config({
    path:"./.env",
})

const mongoURI=process.env.MONGO_URI
const port =process.env.PORT || 3000
 export const envMode=process.env.NODE_ENV.trim() || "PRODUCTION"
 const userSocketIDs = new Map();
 const onlineUsers = new Set();

const app=express();
const server=createServer(app)
const io=new Server(server,{cors:corsOption})
app.set("io",io)

//using middleware here

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOption))


connectDB(mongoURI)

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})



app.use("/api/v1/user",userRoute)
app.use("/api/v1/chat",chatRoute)

app.get("/",(req,res)=>{
    res.send("hello how are you")
})



io.use((socket, next) => {
    cookieParser()(
      socket.request,
      socket.request.res,
      async (err) => await socketAuth(err, socket, next)
    );
  });
  

io.on("connection",(socket)=>{
   

    const user=socket.user
    
    userSocketIDs.set(user._id.toString(),socket.id)
   

    socket.on(NEW_MESSAGE,async ({chatId,members,message})=>{
        const msgForRealTime={
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name

            },
            chat:chatId,
            createdAt:new Date().toISOString()
        }

        const msgForDB={
            content:message,
            sender:user._id,
            chat:chatId
        }
       

        const memberSockets=getSockets(members)
        io.to(memberSockets).emit(NEW_MESSAGE,{
            chatId,
            message:msgForRealTime
        })
        io.to(memberSockets).emit(NEW_MESSAGE_ALERT,{
            chatId,
           
        })
       
        try {
            await Message.create(msgForDB)
        } catch (error) {
            console.log(error)
        }
       
        
    
    })

    socket.on(START_TYPING,({members,chatId})=>{
        const membersSocket=getSockets(members)
        socket.to(membersSocket).emit(START_TYPING,{chatId})
    })

    socket.on(STOP_TYPING,({members,chatId})=>{
        const membersSocket=getSockets(members)
        socket.to(membersSocket).emit(STOP_TYPING,{chatId})
    })

    socket.on(CHAT_JOINED,({userId,members})=>{
       onlineUsers.add(userId.toString())
       const membersSocket=getSockets(members)
       io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers))
    })
    socket.on(CHAT_LEAVED,({userId,members})=>{
        onlineUsers.delete(userId.toString())
        const membersSocket=getSockets(members)
        io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers))
    })

    socket.on("disconnect",()=>{

        console.log("user disconnected")
        userSocketIDs.delete(user._id.toString())
        onlineUsers.delete(user._id.toString())
        socket.broadcast.emit(ONLINE_USERS,Array.from(onlineUsers))
    })
})

app.use(errorMiddleware)



server.listen(port,()=>{
    console.log(`Server running on port ${port} in ${envMode} mode`)
})

export {userSocketIDs}