const commentQueries = require('../prisma/queries/commentQueries');
const { matchedData } = require('express-validator');

// Constants
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

// Helper Functions
function handleError(res, operation, error) {
    console.error(`Error ${operation}:`, error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: `Error ${operation}`,
        error: error.message
    });
}

// Handler Functions
async function getAllComments(req, res) {
    try {
        const comments = await commentQueries.getComments();
        return res.status(HTTP_STATUS.OK).json({
            message: 'Comments retrieved successfully',
            data: comments
        });
    } catch (error) {
        return handleError(res, 'fetching comments', error);
    }
}

async function getBlogComments(req, res) {
    try {
        const { blogId } = matchedData(req, { locations: ['params'] });
        const comments = await commentQueries.getCommentsByBlogId(blogId);
        
        return res.status(HTTP_STATUS.OK).json({
            message: 'Blog comments retrieved successfully',
            data: comments
        });
    } catch (error) {
        return handleError(res, 'fetching blog comments', error);
    }
}

async function getCommentById(req, res) {
    try {
        const { commentId } = matchedData(req, { locations: ['params'] });
        const comment = await commentQueries.getCommentById(commentId);
        
        if (!comment) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Comment with ID ${commentId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'Comment retrieved successfully',
            data: comment
        });
    } catch (error) {
        return handleError(res, 'fetching comment', error);
    }
}

async function createComment(req, res) {
    try {
        const createData = matchedData(req, { locations: ['body'] })
        const comment = await commentQueries.postComment(createData);
        
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Comment created successfully',
            data: comment
        });
    } catch (error) {
        return handleError(res, 'creating comment', error);
    }
}

async function updateComment(req, res) {
    try {
        const { commentId } = matchedData(req, { locations: ['params'] });
        const updateData = matchedData(req, { locations: ['body'] });
        const updatedComment = await commentQueries.putComment(commentId, updateData);
        
        if (!updatedComment) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Comment with ID ${commentId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'Comment updated successfully',
            data: updatedComment
        });
    } catch (error) {
        return handleError(res, 'updating comment', error);
    }
}

async function deleteComment(req, res) {
    try {
        const { commentId } = matchedData(req, { locations: ['params'] });
        const deletedComment = await commentQueries.deleteComment(commentId);
        
        if (!deletedComment) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Comment with ID ${commentId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'Comment deleted successfully',
            data: { id: commentId }
        });
    } catch (error) {
        return handleError(res, 'deleting comment', error);
    }
}

module.exports = {
    getAllComments,
    getBlogComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};