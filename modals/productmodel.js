const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
    product_id:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    title:{
          type:String,
          trim:true,
          required:true
    }, 
    price:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    images: {
        type: Object,
        required: true
      },
    category:{
          type:String,
          required:true
    },
    checked:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Boolean,
        default:0
    }
},{
    timestamps:true 
}); 
ProductSchema.index({ title: "text",content:"text",description:"text",category:"text"});    
module.exports=mongoose.model('Products',ProductSchema);  



