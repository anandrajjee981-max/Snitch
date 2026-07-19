import express from 'express'
const authrouter = express.Router()
import { registerValidator } from '../validator/auth.validator.js'
import { register,login ,googleAuth,googleAuthCallback, getme} from '../controller/auth.controller.js'
import passport from 'passport'
import { verifyme } from '../middleware/auth.middleware.js'

authrouter.post("/register",registerValidator,register)
authrouter.post("/login",login)
authrouter.get('/google',googleAuth)
authrouter.get('/google/callback',googleAuthCallback)
authrouter.get('/getme',verifyme,getme)

export default authrouter
