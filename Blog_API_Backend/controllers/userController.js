const userQueries = require('../prisma/queries/userQueries');

const allowedFields = {
  create: ['email', 'name', 'username', 'password', 'roleId'],
  update: ['name', 'username', 'password', 'roleId']
};

function sanitizeData(data, fields) {
  return Object.entries(data).reduce((sanitized, [key, val]) => {
    let value = val;
    if (typeof val === 'string' && key !== 'password') {
      value = value.trim();
    }
    if (fields.includes(key)) {
      sanitized[key] = value;
    }
    return sanitized;
  }, {});
}

async function handleUserOperation(operation) {
  return async (req, res) => {
    try {
      let result;
      const userId = req.params.userId;

      switch (operation) {
        case 'getAll':
          result = await userQueries.getUsers();
          break;
        case 'getOne':
          result = await userQueries.getUserById(userId);
          break;
        case 'create':
          const createData = sanitizeData(req.body, allowedFields.create);
          result = await userQueries.postUsers(createData);
          break;
        case 'update':
          const updateData = sanitizeData(req.body, allowedFields.update);
          result = await userQueries.putUser(userId, updateData);
          break;
        case 'delete':
          result = await userQueries.deleteUser(userId);
          break;
      }

      res.status(200).json(result);
    } catch (error) {
      const messages = {
        getAll: 'fetching users',
        getOne: 'fetching user',
        create: 'creating user',
        update: 'updating user',
        delete: 'deleting user'
      };
      
      res.status(500).json({ 
        message: `Error ${messages[operation]}`, 
        error: error.message 
      });
    }
  };
}

module.exports = {
  getUsers: handleUserOperation('getAll'),
  getUserById: handleUserOperation('getOne'),
  createUser: handleUserOperation('create'),
  updateUser: handleUserOperation('update'),
  deleteUser: handleUserOperation('delete')
};