import express from 'express'
const buyerrouter = express.Router()
import { getproduct } from '../controller/buyer.controller.js'
buyerrouter.get("/get",getproduct)



export default buyerrouter