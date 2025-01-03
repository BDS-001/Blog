const commentQueries = require('../prisma/queries/commentQueries');

const allowedFields = {
  create: ['content', 'userId', 'blogId', 'parentId'],
  update: ['content']
};

function sanitizeData(data, fields) {
  return Object.entries(data).reduce((sanitized, [key, val]) => {
    let value = val;
    if (typeof val === 'string') {
      value = value.trim();
    }
    if (fields.includes(key)) {
      sanitized[key] = value;
    }
    return sanitized;
  }, {});
}

async function handleCommentOperation(operation) {
  return async (req, res) => {
    try {
      let result;
      const commentId = req.params.commentId;
      const blogId = req.params.blogId;

      switch (operation) {
        case 'getAll':
          result = await commentQueries.getComments();
          break;
        case 'getAllBlog':
            result = await commentQueries.getCommentsByBlogId(blogId);
            break;
        case 'getOne':
          result = await commentQueries.getCommentById(commentId);
          break;
        case 'create':
          const createData = sanitizeData(req.body, allowedFields.create);
          result = await commentQueries.postComment(createData);
          break;
        case 'update':
          const updateData = sanitizeData(req.body, allowedFields.update);
          result = await commentQueries.putComment(commentId, updateData);
          break;
        case 'delete':
          result = await commentQueries.deleteComment(commentId);
          break;
      }

      res.status(200).json(result);
    } catch (error) {
      const messages = {
        getAll: 'fetching comments',
        getAllBlog: 'fetching blog comments',
        getOne: 'fetching comment',
        create: 'creating comment',
        update: 'updating comment',
        delete: 'deleting comment'
      };
      
      res.status(500).json({ 
        message: `Error ${messages[operation]}`, 
        error: error.message 
      });
    }
  };
}

module.exports = {
    getComments: handleCommentOperation('getAll'),
    getBlogComments: handleCommentOperation('getAllBlog'),
    getCommentById: handleCommentOperation('getOne'),
    createComment: handleCommentOperation('create'),
    updateComment: handleCommentOperation('update'),
    deleteComment: handleCommentOperation('delete'),
};