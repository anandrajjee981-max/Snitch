import express from 'express'
const buyerrouter = express.Router()
import { getproduct } from '../controller/buyer.controller.js'
import { searchProducts } from '../controller/search.controller.js'
buyerrouter.get("/get",getproduct)
buyerrouter.get("/search",searchProducts)


export default buyerrouter