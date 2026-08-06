import express from "express"
const cartrouter = express.Router()
import { addtocart,getcart,removecartitem, updatecartquantity } from "../controller/cart.controller.js"
import { cartValidator } from "../validator/cart.validator.js"
import { verifyme } from "../middleware/auth.middleware.js"
cartrouter.post("/add/:productid",verifyme,cartValidator, addtocart)
cartrouter.get("/",verifyme, getcart)
cartrouter.delete("/remove/:productid",verifyme, removecartitem)
cartrouter.patch("/:productid",verifyme, updatecartquantity)

export default cartrouter

