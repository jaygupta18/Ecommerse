const Users=require('../modals/UserModel')
const authAdmin=async (req,res,next)=>{
    // console.log(req.user.id);
    try{
         const user=await Users.findOne({
            _id:req.user.id
         })
         if(user.role==0)return res.status(400).json({msg:"not a admin"})
         next();   
    }
    catch(err){
        return res.json({msg:err})
    }
} 
module.exports={authAdmin} 
