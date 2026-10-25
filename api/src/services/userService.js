const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const createUser = async (userData) => { 
  
  if (!userData.name || userData.name.trim() === '') {
    const error = new Error('Los datos no son válidos');
    error.status = 422;
    error.code = 'VALIDATION_ERROR';
    error.details = [{field: 'name', message: 'El nombre es obligatorio'}];
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!userData.email || !emailRegex.test(userData.email)) {
    const error = new Error('Los datos no son válidos');
    error.status = 422;
    error.code = 'VALIDATION_ERROR';
    error.details = [{field: 'email', message: 'Formato incorrecto'}];
    throw error;
  }

  if (!userData.password || userData.password.length < 12) {
    const error = new Error('Los datos no son válidos');
    error.status = 422;
    error.code = 'VALIDATION_ERROR';
    error.details = [{field: 'password', message: 'Debe tener al menos 12 caracteres'}];
    throw error;
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const newUser = new User({name: userData.name, email: userData.email, passwordHash, role: 'client'});

  return await newUser.save(); 
}; 

const getAllUsers = async (query) => {
  const filters = {};

  if (query.active !== undefined){
    filters.active = query.active === 'true';
  }

  if (query.name) {
    filters.name = {$regex: query.name, $options: 'i'};
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
  const total = await User.countDocuments(filters);
  const users = await User.find(filters).select('-passwordHash').sort(sort).skip(skip).limit(limit);  

  return {
    data: users,
    pagination: {
        page,
        limit,
        total,
        totalPages:
            Math.ceil(total / limit)
    }
};

};

const getUserById = async (id) => {
    return await User.findById(id).select('-passwordHash');
};

const updateUser = async (id, userData) => {
    const allowedFields = ['name','email'];
    const updateData = {};

    allowedFields.forEach(field => {
    if (userData[field] !== undefined) {
        updateData[field] = userData[field];
        }
    });
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

};

const deactivateUser = async (id) => {
    return await User.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
    );
};

module.exports = { 
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser
}; 
