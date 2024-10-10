import express from 'express';
import { isAuth } from '../middlewares/auth.js';
import { newGroupChat,getMyChats ,getMyGroups,addMembers,removeMembers,leaveGroup,sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages} from '../controllers/chat.js';
import {attachmentsMulter} from "../middlewares/multer.js"
import { addMemberValidator, deleteChatValidator, getChatDetailsValidator, getMessagesValidator, leaveGroupValidator, newGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentValidator, validateHandler } from '../lib/validators.js';

const app =express.Router()



//login required
app.use(isAuth)

app.post("/new",newGroupValidator(),validateHandler,newGroupChat)
app.get("/my",getMyChats)
app.get("/my/groups",getMyGroups)
app.put("/addmembers",addMemberValidator(),validateHandler,addMembers)
app.put("/removemembers",removeMemberValidator(),validateHandler,removeMembers)
app.delete("/leave/:id",leaveGroupValidator(),validateHandler,leaveGroup)

app.post("/message",attachmentsMulter,sendAttachmentValidator(),validateHandler,sendAttachments)
app.get("/message/:id",getMessagesValidator(),validateHandler,getMessages)

app
  .route("/:id")
  .get(getChatDetailsValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroup)
  .delete(deleteChatValidator(), validateHandler, deleteChat);


export default app;
