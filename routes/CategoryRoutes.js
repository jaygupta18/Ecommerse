const router=require('express').Router() ;
const {getcategory,postcategory,deletecategory,updatecategory}=require('../userController/categoryctrl')
const {auth}=require('../middleware/auth');
const {authAdmin}=require('../middleware/authAdmin');

router.get('/getcategory',getcategory);
router.post('/postcategory',auth,authAdmin,postcategory);   
router.delete('/deletecategory/:id',auth,authAdmin,deletecategory); 
router.put('/updatecategory/:id',auth,authAdmin,updatecategory);
module.exports=router; 









