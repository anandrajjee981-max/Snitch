import mongoose from 'mongoose'

const productschema = new mongoose.Schema({
title:{
    type :String ,
    required:true 
},
description :{
    type :String ,
    required :true 
},
productprice:{
price :{
    type :Number ,
required :true
},
currency :{
    type :String ,
    enum :["INR","USD",'YEN'],
    default:"INR"
}
},
user :{
type :mongoose.Types.ObjectId,
ref:"User",
required :true 

},
image :{
    type :String ,
    required :true
}


})


const productmodel = mongoose.model("product",productschema)
export default productmodel









