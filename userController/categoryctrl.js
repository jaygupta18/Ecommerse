const Product=require('../modals/productmodel');
const categoryctrl={
getcategory: async (req,res)=>{
    try{
        const query=req.query.q;
        console.log(query);
        const products=await Product.find({
            $or: [
                { category: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                // { title: { $regex: query, $options: 'i' } },
              ],
        }
        );
        console.log(products);
        res.json({products});
        
    } 
    catch(err){
        console.log(err.errmsg);
        res.json({msg:err.msg});
    }
},
 postcategory:async (req,res)=>{
    try{
        const {name}=req.body;
        const category=await Category.findOne({name})
        if(category){
            return res.status(400).json({msg:"category already exist"})
        }
        const newcategory=new Category({name})
        await newcategory.save();
        res.json({msg:"successfully category created"})
    }
    catch(err){
        return res.json({msg:"error at postcategory"})
    }
 },
 deletecategory:async (req,res)=>{
    try{
         const dcategory=await Category.findByIdAndDelete(req.params.id) 
         res.json({msg:"successfully deleted"}) 
    }
    catch(err){
        return res.json({msg:"error at deletecategory"})
    }
 },
 updatecategory:async (req,res)=>{
    try{
        const {name}=req.body;
        await  Category.findByIdAndUpdate({_id:req.params.id},{name});
        res.json({msg:"updated successufully"})
    }
    catch(err){
         return res.json({msg:"error occured at updatecategory"})
    }
 }
} 

module.exports=categoryctrl     



