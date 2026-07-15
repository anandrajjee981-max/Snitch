import express from 'express'
const productrouter = express.Router()
import { verifyseller } from '../middleware/auth.middleware.js'
import multer from 'multer'
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})


productrouter.post("/post",verifyseller,upload.array("images",7))



