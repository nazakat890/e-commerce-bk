const productModel= require('../models/Product')
const CategoryModel = require('../models/Category');
const { default: mongoose } = require('mongoose');



const createProduct = async (req, res) => {
    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request');
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
   try {
    const product = new productModel({
        name : req.body.name,
        description: req.body.description,
        richDescription : req.body.richDescription,
        image : `${basePath}${fileName}`,
        brand : req.body.brand,
        price : req.body.price,
        category: req.body.category, 
        countInStock : req.body.countInStock,
        rating : req.body.rating,
        numReviews : req.body.numReviews,
        isFeatured : req.body.isFeatured,
    })
     const savedProduct =await product.save();
     if(!savedProduct) return res.status(404).json({success: false, message:'Product could not be created'})
    res.status(201).json({product : savedProduct, message: 'Product created successfully' });
   }
   catch(err) {
    res.status(400).json({err: err.message});
   }

}
const getProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).populate('category')
        if(!product) return res.status(404).json({error:'Product not found'})
        res.status(200).json(product)
    }
    catch(error) {
        res.status(400).json({ error: error.message})
    }
}
const getProducts = async (req, res) => {
    let filter = {};
    if(req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }
    
    try  {
        const products = await productModel.find(filter).populate('category')
        res.status(200).json({data:products})
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}
const updateProduct = async (req, res) => {
    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');
    try {
        const product = await productModel.findByIdAndUpdate(req.params.id, req.body, {new:true}).populate('category')
        if(!product) return res.status(404).json({error:'Product not found'})
            res.status(200).json(product)
      } catch(error) {
        res.status(400).json({ error: error.message})
      }

}
const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({error:'Product not found'})
        res.status(200).json({message:'Product deleted successfully'});
       }
       catch(error) {
        res.status(400).json({ error: error.message})
       }
}

const getProductCount = async (req, res) => {
    try { 
        const productCount = await productModel.countDocuments({}).exec();
        if(!productCount) return res.status(404).json({message:'products not exist'})

          res.status(200).json({productCount : productCount})
    }
    catch(err) {
        res.status(400).json({success: false, error: err.message})
    }
}

const getFeatureProduct = async (req, res) => {
       const count = req.params.count ? req.params.count : 0;
    try { 
        const products = await productModel.find({isFeatured: true}).limit(count);
        if(!products) return res.status(404).json({message:'products not exist'})
          res.status(200).json({products : products})
    }
    catch(err) {
        res.status(400).json({success: false, error: err.message})
    }
}

const gallaryImageUpload = async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid Product Id'})
  }
  const files = req.files;

  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  if(files) {
    files.map(file => {
        imagesPaths.push(`${basePath}${file.filename}`)
    })
  }
  const product = await productModel.findByIdAndUpdate(
    req.params.id,
    {
        images: imagesPaths
    },
    { new:true}
)
   if(!product) return res.status(404).json({error:'Product not found'})
    res.status(200).json(product)
  }















module.exports = {
        createProduct,
        getProduct,
        getProducts, 
        updateProduct, 
        deleteProduct, 
        getProductCount,
        getFeatureProduct,
        gallaryImageUpload
     }