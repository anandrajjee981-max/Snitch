import express from 'express'
const paymentrouter = express.Router()
import { verifyme } from '../middleware/auth.middleware.js'
import { createPaymentOrder, updatePaymentStatus, getPaymentDetails, getUserPayments } from '../controller/payment.controller.js'

paymentrouter.post("/create", verifyme, createPaymentOrder)
paymentrouter.patch("/update", verifyme, updatePaymentStatus)
paymentrouter.get("/user-payments", verifyme, getUserPayments)
paymentrouter.get("/details/:orderId", verifyme, getPaymentDetails)

export default paymentrouter


