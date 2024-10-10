import express from 'express'
import { acceptRequest, getAllNotifcations, getMyFriends, getMyProfile, login ,logout,newUser, searchUser, sendRequest} from '../controllers/user.js';
import { multerUpload } from '../middlewares/multer.js';
import { isAuth } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from '../lib/validators.js';

const app =express.Router()

//no login required
app.post("/new",multerUpload.single("avatar"),registerValidator(),validateHandler,newUser)
app.post("/login",loginValidator(),validateHandler,login)

//login required
app.use(isAuth)
app.get("/me",getMyProfile)
app.get("/logout",logout)
app.get("/search",searchUser)
app.put("/sendrequest",sendRequestValidator(),validateHandler,sendRequest)
app.put("/acceptrequest",acceptRequestValidator(),validateHandler,acceptRequest)
app.get("/notifications",getAllNotifcations)
app.get("/friends",getMyFriends)

export default app;
