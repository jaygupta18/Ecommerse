const router=require('express').Router();
const { auth } =require( '../middleware/auth.js');
const { authAdmin } =require("../middleware/authAdmin.js");


const {getproduct,postproduct,deleteproduct,updateproduct,Search, getproductbyid}=require('../userController/productctrl') 
router.get('/getproduct',getproduct); 
router.post('/postproduct',auth,authAdmin,postproduct);
router.delete('/deleteproduct/:id',deleteproduct);  
router.put('/updateproduct/:id',updateproduct);
router.get('/getproductbyid',getproductbyid)
router.get('/Search',Search); 
module.exports=router;  






