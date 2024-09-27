const router=require('express').Router()
const {register,corefreshtoken,login,logout,getuser,getCart,addToCart,removeFromCart,getcapro,updateCart}=require('../userController/userctrl') 
const {auth}=require('../middleware/auth')
router.post('/register',register); 
router.get('/refresh_token',corefreshtoken);
router.post('/login',login)
router.get('/logout',logout) 
router.get('/info',auth,getuser)  
router.get('/cart',auth,getCart);
router.post('/postcart',auth,addToCart);
router.delete('/deletecart/:id',auth,removeFromCart);
router.post('/getcartpro',getcapro);
router.put('/updateCart/:id',auth,updateCart)
module.exports=router; 




