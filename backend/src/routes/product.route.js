import express from 'express'
const productrouter = express.Router()
import { verifyseller } from '../middleware/auth.middleware.js'
import { submitproduct, getproduct, getproductbyid, submitvariant, editproduct, editstock ,editvariantstock} from '../controller/product.controller.js'
import multer from 'multer'
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})


productrouter.post("/post",verifyseller,upload.array("images",7),submitproduct)
productrouter.get("/get",verifyseller,getproduct)
productrouter.get("/get/:productid",verifyseller,getproductbyid)
productrouter.post("/variant/:productid",verifyseller,upload.array("images",7),submitvariant)
productrouter.patch("/edit/:productid",verifyseller,upload.array("images",7),editproduct)
productrouter.patch("/editstock/:productid",verifyseller,editstock)
productrouter.patch("/editvariantstock/:productid/:variantid",verifyseller,editvariantstock)
export default productrouter

