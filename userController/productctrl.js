const Products=require('../modals/productmodel');  
// Products.index({ title: "text", description: "text", content: "text" });

const {upload,uploadToCloudinary} =require('../middleware/multer');
 
class APIfeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }  

    
filter(){
const queryObj={...this.queryString};
const excludedFields=['page','sort','limit'];
excludedFields.forEach(el=>delete(queryObj[el]));
let querystr=JSON.stringify(queryObj);
querystr=querystr.replace(/\b(gte|gt|lte|lt|regex)\b/g,match=>'$'+match);
this.query.find(JSON.parse(querystr)); 
return this;
}    
    sorting(){
        if(this.queryString.sort){
            console.log(this.queryString.sort)
            const sortBy=this.queryString.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy)
        }
        else{
            this.query=this.query.sort('-createAt')
        }
        return this 
    }   
    pagination(){
          const page=this.queryString.page*1 || 1;
          const limit=this.queryString.limit *1 ||9;
          const skip=(page-1)*limit;
          this.query=this.query.skip(skip).limit(limit);
          return this ;
    }
}   
   
const getproductbyid=async(req,res)=>{
    const id=req.query.q;
    // console.log(id);
    try{

        const product=await Products.findById(id);
        if(!product){
            return res.status(404).json({success:false,message:"product not found"})
        }
        // console.log({product})
        res.status(200).json({product})
    }
    catch(err){

        return res.status(404).json({success:false,message:"product not found"});
    }
    
} 
const getproduct=async (req,res)=>{
    try{
        const features=new APIfeatures(Products.find(),req.query).filter().sorting(); 
        const product=await features.query;
        // console.log(features)
        return res.status(200).json({product});
    }    
    catch(err){
        return res.json({msg:"error at getproduct"})
    }
}       
              
const postproduct = async (req, res) => {
    // console.log(req.body);
    try {
      upload.single('images')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message:err});
        } 
        await uploadToCloudinary(req, res, async () => {
          const { product_id, title, price, description, content, category } = req.body;
          const findid=await Products.find({product_id});
        //   console.log(findid);
          if(findid.length>0){
            return res.status(400).json({ message: "product id already exist" });
          }
          const newproduct = new Products({
            product_id,
            title: title.toLowerCase(),
          price,
          description,
          content,
          images: req.file.url,
          category,
        });
        newproduct.save();
        res.json({ newproduct });
      });
    });
} catch (err) {
    return res.json({ msg: 'error at postproduct' });
  }
};

const deleteproduct=async (req,res)=>{
    try{
         await Products.findByIdAndDelete(req.params.id)
         res.json({msg:"deleted a product"});
    }
    catch(err){
        return res.status(200).json({msg:"error at deleteproduct"})
    } 
} 
const updateproduct=async (req,res)=>{
    try{
        const {title,price,description,content,images,category}=req.body;
        if(!images)return res.json({msg:"No image uploaded"});
        await Products.findOneAndUpdate({_id:req.params.id},{
            title:title.toLowerCase(),
            price,
            description,
            content,
            images,
            category
        })
      return   res.status(200).json({msg:"successfully updated"});
         
    }  
    catch(err){
        return res.json({msg:"error at updateproduct"})
    }
} 

const Search=async(req,res)=>{
    try{
        const query=req.query.q;
        console.log(query);
        const products=await Products.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
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
};

module.exports={getproduct,postproduct,deleteproduct,updateproduct,Search,getproductbyid};  






