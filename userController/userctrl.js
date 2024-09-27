 const Users=require('../modals/UserModel')  
 const bcyrpt=require('bcrypt') 
 const jwt=require('jsonwebtoken');
 const Products =require('../modals/productmodel');
 const createAccessToken=(payload)=>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'},{algorithm: 'HS256'})  
}      
   
 const corefreshtoken = async (req, res) => {
        try { 
          const rf = req.cookies.refreshtoken;
          // console.log(rf);
          if (!rf) {
            return res.status(400).json({ msg: "Please login or register now" });
          } 
           
          const decode =jwt.decode(rf);
          // console.log(decode);
          // const 
          const user=await Users.findById(decode.id);
          if(user){
            const accessToken = createAccessToken({ id: user._id });
              res.json({accessToken });
          } 
          // jwt.verify(rf, process.env.REFRESH_TOKEN_SECRET,{ algorithms: ['HS256'] }, (err, user) => {
          //   // console.log(process.env.REFRESH_TOKEN_SECRET);
          //   if (err) {
          //     return res.status(400).json(err.message);
             
          //   } 
      
          //   const accessToken = createAccessToken({ id: user._id });
          //   res.json({accessToken });
          // }) 
        } catch (err) {
          // console.error(err);
          res.status(500).json({ msg: "Error at corefreshtoken" });
        }
      };
        
  
 const createRefreshToken=(payload)=>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'},{algorithm: 'HS256'})
 }   
  const   register=async(req,res)=>{
        try{
            
             const {name,email,password}=req.body 
             const user=await Users.findOne({email})
             if(user)return res.status(400).json({msg:"already registered"}) 
             if(password.length<6) return res.status(400).json({msg:"password must be greater than 6 characters"})
             const passwordHash=await bcyrpt.hash(password,10) 
            const newUser=new Users({
            name,email,password:passwordHash
        })

        await newUser.save();
        const accesstoken=createAccessToken({id:newUser._id})
        const refreshtoken=createRefreshToken({id:newUser._id})
        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:'/user/refresh_token',
           

        })  
        res.json(accesstoken) 
        }           
        catch(err){
            // console.log(err);
            return res.status(500).json({msg:"some error occured"})
        } 
    }  
     const login=async (req,res)=>{
        try{
              const {email,password}=req.body;
              const user= await Users.findOne({email})
              if(!user){
                return res.status(400).json({msg:"user is not registered"})
              }
              const ismatch=await bcyrpt.compare(password,user.password)
              if(!ismatch){
                return res.status(400).json({msg:"incorrect password "})
              }  
              const accesstoken=createAccessToken({id:user._id})
              const refreshtoken=createAccessToken({id:user._id}) 
              res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                path:'/user/refresh_token',
                
    
            })  
              res.json(accesstoken)
        } 
        catch(err){
             return res.status(500).json({msg:"error at login"})
        }
     }          
     const logout=async (req,res)=>{
               try{
                      res.clearCookie('refreshtoken',{path:'/user/refresh_token'}) 
                      return res.json({msg:"logout successfully"})
               }
               catch(err){
                res.json({msg:"error at logout "});
               } 
     }      
 const getuser=async (req,res)=>{
            try{
              const user=await Users.findById(req.user.id).select('-password') 
              if(!user)return res.json({msg:"can't able to find user"})   
              return res.json(user)
              // return res.json(req.user)
            }  
            catch(err){
               return res.json({msg:'error at getuser'})
            }
 }      
 
 const getCart = async (req, res) => {
  // console.log(req.user);
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: "User not found" });
    // console.log(user);
    res.json(user.cart);
  } catch (err) {
    return res.status(500).json({ msg: "Error at getCart" });
  }
}; 

const addToCart = async (req, res) => {
  try { 
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: "User not found" });
  
    
    const { productId, quantity } = req.body;
    // console.log({productId});
    const existingProduct = user.cart.find((item) => item.productId === productId);
    // console.log(existingProduct);
    if (existingProduct!=undefined) {
      return res.json({msg:"this product is already present in your cart "});
    } else {
      user.cart.push({ productId, quantity});
    }
    await user.save();
    return res.json({msg:"successfully added to cart"});
  } catch (err) {
    return res.status(500).json({ msg: "Error at addToCart" });
  }
};


const getcapro = async (req, res) => {
  // console.log(req.user.id);
  const { productIds } = req.body; 
  // console.log(req.body);
  
  try {
    const products = await Products.find({ _id: { $in: productIds } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}; 
 
const removeFromCart = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    // console.log(user);
    if (!user) return res.status(400).json({ msg: "User not found" });
    // console.log(req.params.id);
    const productId=req.params.id;
    user.cart = user.cart.filter((item) => item.productId !== productId);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    return res.status(500).json({ msg: "Error at removeFromCart" });
  }
}; 

const updateCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const newQuantity = req.body.quantity;
    console.log(req.body.quantity);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      return res.status(400).json({ msg: "Invalid quantity value" });
    }
    
    const user = await Users.findOneAndUpdate(
      { _id: req.user.id, "cart.productId": productId },
      { $set: { "cart.$.quantity": newQuantity } }, // `$` operator updates the matched item
      { new: true }
    );
     
    if (!user) {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    res.json({ msg: "Quantity updated successfully", cart: user.cart });
  } catch (err) {
    return res.status(500).json({ msg: "Error at updateCart", error: err.message });
  }
};


module.exports={register,corefreshtoken,login,logout,getuser,getCart,addToCart,removeFromCart,getcapro,updateCart};   










