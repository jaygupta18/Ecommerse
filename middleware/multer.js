const multer = require('multer');
const cloudinary = require('./cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path=require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(undefined, true);
  },
});

const uploadToCloudinary = async (req, res, next) => {
  try {
    // console.log('Request body:', req.body);
    // console.log('Request file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const result = await cloudinary.uploader.upload(req.file.path);
    req.file.url = result.secure_url;
    req.file.public_id = result.public_id;
    next();
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
  }
};


module.exports = { upload, uploadToCloudinary };
