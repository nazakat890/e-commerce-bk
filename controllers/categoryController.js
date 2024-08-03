const CategoryModel = require('../models/Category')


const createCategory = async (req, res) => {

    const { name, icon, color} = req.body;
    
    try {
     const category = new CategoryModel ({ name, icon, color })
     await category.save();
     if(!category) return res.status(404).send('the category cannot be created!')
     res.status(201).json({category:category, message: 'Category created successfully' });
    }
    catch(err) {
     res.status(400).json({err: err.message});
    }
 
 }

 const getCategory = async (req, res) => {
     try {
         const category = await CategoryModel.findById(req.params.id)
         if(!category) return res.status(404).json({error:'Category not found'})
         res.status(200).json(category)
     }
     catch(error) {
         res.status(400).json({ error: error.message})
     }
 }
 const getCategories = async (req, res) => {
     try  {
         const categories = await CategoryModel.find()
         res.status(200).json({data:categories})
     } catch(error) {
         res.status(400).json({ error: error.message})
     }
 }
 const updateCategory = async (req, res) => {
     try {
         const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
         if(!category) return res.status(404).json({error:'Category not found'})
             res.status(200).json(category)
       } catch(error) {
         res.status(400).json({ error: error.message})
       }
 
 }
 const deleteCategory = async (req, res) => {
     try {
         const category = await CategoryModel.findByIdAndDelete(req.params.id);
         if(!category) return res.status(404).json({error:'Category not found'})
         res.status(200).json({message:'Category deleted successfully'});
        }
        catch(error) {
         res.status(400).json({ error: error.message})
        }
 }
 


module.exports = {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
}