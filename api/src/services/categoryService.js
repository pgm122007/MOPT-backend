const Category = require('../models/category');

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // quita tildes
    .replace(/[^a-z0-9]+/g, '-')       // todo lo no alfanumérico -> "-"
    .replace(/^-+|-+$/g, '');          // quita guiones al inicio/final

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createCategory = async (categoryData) => {
  const name = categoryData.name ? categoryData.name.trim() : '';

  if (name.length < 3) {
    const error = new Error('Los datos no son válidos');
    error.status = 422;
    error.code = 'VALIDATION_ERROR';
    error.details = [{
      field: 'name',
      message: name === '' ? 'El nombre es obligatorio' : 'El nombre debe tener al menos 3 caracteres'
    }];
    throw error;
  }

  const slug = categoryData.slug ? slugify(categoryData.slug) : slugify(name);

  try {
    const newCategory = new Category({ ...categoryData, name, slug });
    return await newCategory.save();
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Ya existe una categoría con ese slug');
      error.status = 409;
      error.code = 'DUPLICATE_ERROR';
      error.details = [{ field: 'slug', message: 'El slug debe ser único' }];
      throw error;
    }
    throw err;
  }
};

const getAllCategories = async (query = {}) => {
  const filters = {};

  if (query.active !== undefined) {
    filters.active = query.active === 'true';
  }

  if (query.name) {
    filters.name = { $regex: escapeRegex(query.name), $options: 'i' };
  }

  const sort = query.sort || 'name';
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  if (page < 1) {
    const error = new Error('Página inválida');
    error.status = 400;
    throw error;
  }

  if (limit < 1) {
    const error = new Error('Límite inválido');
    error.status = 400;
    throw error;
  } else if (limit > 50) {
    const error = new Error('Máximo 50 registros');
    error.status = 400;
    throw error;
  }

  const skip = (page - 1) * limit;
  const total = await Category.countDocuments(filters);
  const categories = await Category.find(filters)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    data: categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
    runValidators: true   // aplica minlength, maxlength, etc. también al actualizar
  });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};