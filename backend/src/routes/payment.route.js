import express from 'express'
const paymentrouter = express.Router()
import { verifyme } from '../middleware/auth.middleware.js'
import { createPaymentOrder, updatePaymentStatus,getPaymentDetails } from '../controller/payment.controller.js'

paymentrouter.post("/create",verifyme,createPaymentOrder)
paymentrouter.patch("/update",verifyme,updatePaymentStatus)
paymentrouter.get("/details/:orderId",verifyme,getPaymentDetails)




export default paymentrouter


