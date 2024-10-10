import jwt from "jsonwebtoken";
import { Errorhandler } from "../utils/utility.js";
import { SANDESH_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";


const isAuth= (req,res,next)=>{
    const token =req.cookies[SANDESH_TOKEN]
   if(!token) return next(new Errorhandler("Please Login",401))

   const decodedData=jwt.verify(token,process.env.JWT_SECRET)
   req.user=decodedData._id
  next()
}

const socketAuth =async (err,socket,next)=>{
 


try {
  if (err) return next(err);

  const authToken = socket.request.cookies[SANDESH_TOKEN];

  if (!authToken)
    return next(new Errorhandler("Please login to access this route", 401));

  const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

  const user = await User.findById(decodedData._id);

  if (!user)
    return next(new Errorhandler("Please login to access this route", 401));

  socket.user = user;

  return next();
} catch (error) {
  console.log(error);
  return next(new Errorhandler("Please login to access this route", 401));
}

}

export {isAuth,socketAuth}