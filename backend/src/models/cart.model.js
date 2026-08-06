import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({   
user:{
type:mongoose.Schema.Types.ObjectId,
ref:'User'
},
items:[{
productid:{
    type:String
},
origin:{
    type:String,
    enum:["Main","Variant"],
    default:"Main"
},
quantity:{
    type:Number,
    default:1 
},
product:{
    price:{
        type:Number,
        default:0
    },
    currency:{
        type:String,
        enum:["USD","EUR","INR"],
        default:"INR"
    }


}
}

]

})
const cartModel = mongoose.model('Cart',cartSchema);
export default cartModel;

