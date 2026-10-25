const categoryService = require('../services/categoryService'); 
const createCategory = async (req, res, next) => { 
try { 
  const category = await categoryService.createCategory(req.body); 
  res.status(201).json({ status: 'success', data: category }); 
} catch (error) { 
  
  if(error.code === 11000){
    return res.status(409).json({
        success: false, 
        error: {
            code: 'DUPLICATE_SLUG', 
            message: 'Ya existe una categoría con ese slug'
        }});
    }
    next(error);

  }
    
}; 

const getAllCategories = async (req, res, next) => {
    try {
        const categories =
            await categoryService.getAllCategories(req.query);
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category =
            await categoryService.getCategoryById(
                req.params.id
            );
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category =
            await categoryService.updateCategory(
                req.params.id,
                req.body
            );
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(
            req.params.id
        );
        res.json({
            message: "Categoria eliminado"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { 
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory 
};
