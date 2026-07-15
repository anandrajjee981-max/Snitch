import { Config } from "../config/config.js";
import jwt from 'jsonwebtoken'
import usermodel from '../models/User.model.js'


export async function verifyseller(req,res,next){
    const token = res.cookies.token
    if(!token){
        return res.status(404).json({
            message :"token not found"
        })
    }
try{
const decoded = await jwt.verify(token,Config.JWT_SECRET)
const user = await usermodel.find(decoded.id)
if(!user){
      return res.status(400).json({
        message :"user not found"
    })
}
if(user.role !== "seller"){
    return res.status(400).json({
        message :"you have not access"
    })
}
   req.user = user
    next()


}
catch(err){
    return res.status(500).json({
        message :"invalid response"
    })
}


}







