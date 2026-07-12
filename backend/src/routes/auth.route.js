import express from 'express'
const authrouter = express.Router()
import { registerValidator } from '../validator/auth.validator.js'
import { register,login ,googleAuth,googleAuthCallback} from '../controller/auth.controller.js'
import passport from 'passport'

authrouter.post("/register",registerValidator,register)
authrouter.post("/login",login)
authrouter.get('/google',googleAuth)
authrouter.get('/google/callback',googleAuthCallback)


export default authrouter
