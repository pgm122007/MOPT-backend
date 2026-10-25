const userService = require('../services/userService'); 
const createUser = async (req, res, next) => { 
try { 
  const user = await userService.createUser(req.body); 
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role }); 
} catch (error) { 
    next(error);
  }
    
}; 

const getAllUsers = async (req, res, next) => {
    try {
        const users =
            await userService.getAllUsers(req.query);
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try { 
      const user =
            await userService.getUserById(
                req.params.id
            );
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user =
            await userService.updateUser(
                req.params.id,
                req.body
            );
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const deactivateUser = async (req, res, next) => {
    try {
        const user =
          await userService.deactivateUser(
              req.params.id
          );
        res.json(user);

    } catch (error) {
        next(error);
    }
};

module.exports = { 
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser
};
