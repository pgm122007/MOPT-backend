const productService = require('../services/productService'); 
const createProduct = async (req, res) => { 
try { 
  const product = await productService.createProduct(req.body); 
  res.status(201).json({ status: 'success', data: product }); 
} catch (error) { 
  res.status(400).json({ status: 'error', message: error.message }); } 
}; 

const getAllProducts = async (req, res) => {
    try {
        const products =
            await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product =
            await productService.getProductById(
                req.params.id
            );
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product =
            await productService.updateProduct(
                req.params.id,
                req.body
            );
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(
            req.params.id
        );
        res.json({
            message: "Producto eliminado"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { 
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct 
};
