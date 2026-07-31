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
seller :{
type :mongoose.Types.ObjectId,
ref:"User",
required :true 

},
image :{
    type :[String],
    required :true
},
variants:[
{
    images: [
     {
      url: {
        type: String
       
     }
      }
            ],
    stock:{
        type:Number ,
        default:0
    },
    attribute:{
        type:Map,
        of:String
    },
productprice:{
price:{
    type:Number
  
},
currency:{
    type:String,
      enum :["INR","USD",'YEN'],
    default:"INR"
}
}


}



]


})


const productmodel = mongoose.model("product",productschema)
export default productmodel









