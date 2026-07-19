import productmodel from '../models/Product.model.js'


export async function getproduct(req,res){
try{
const product = await productmodel.find()
res.status(200).json({
    message : "all submitted products",
    product
})
}
catch(err){
console.log(err)
return res.status(500).json({
    message :"internal server error"
})
}

}





