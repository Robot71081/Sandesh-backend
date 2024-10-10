import {body,validationResult, param, query} from 'express-validator'
import { Errorhandler } from '../utils/utility.js'

const validateHandler=(req,res,next)=>{
    const errors= validationResult(req)
    const errorMsg=errors.array().map((error)=>error.msg).join(", ")
   
    if(errors.isEmpty()) return next()
    else next(new Errorhandler(errorMsg,400))
   }

const registerValidator=()=>[
    body("name","Please enter Name").notEmpty(),
    body("username","Please enter Username").notEmpty(),
    body("bio","Please enter Bio").notEmpty(),
    body("password","Please enter Password").notEmpty(),
    
]

const loginValidator=()=>[
   
    body("username","Please enter Username").notEmpty(),
   
    body("password","Please enter Password").notEmpty()
]

const newGroupValidator=()=>[
   
    body("name","Please enter Name").notEmpty(),
   
    body("members").notEmpty().withMessage("Please enter Members").isArray({min:2,max:100}).withMessage("Members must be between 2-100")
]

const addMemberValidator=()=>[
    body("chatId","Please enter ChatId").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members").isArray({min:1,max:97}).withMessage("Members must be between 1-97")
]

const removeMemberValidator=()=>[
    body("chatId","Please enter ChatId").notEmpty(),
    body("userId","Please enter UserId").notEmpty(),
   
]

const leaveGroupValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    
   
]

const sendAttachmentValidator=()=>[
    body("chatId","Please enter ChatId").notEmpty(),
   
    
   
]

const getMessagesValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    
    
   
]

const getChatDetailsValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    
    
   
]

const renameGroupValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    body("name","Please enter new Name").notEmpty(),
    
    
   
]

const deleteChatValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    
    
   
]

const sendRequestValidator=()=>[
    
    body("userId","Please enter User ID").notEmpty(),
    
    
   
]

const acceptRequestValidator=()=>[
    
    body("requestId").notEmpty().withMessage("Please enter Request ID"),
    body("accept","Please add Accept ").notEmpty().isBoolean().withMessage("Accept must be boolen"),
    
    
   
]



export {registerValidator,validateHandler,loginValidator,newGroupValidator,addMemberValidator,removeMemberValidator,
    leaveGroupValidator,sendAttachmentValidator,getMessagesValidator,getChatDetailsValidator,renameGroupValidator
    ,deleteChatValidator,sendRequestValidator,acceptRequestValidator}