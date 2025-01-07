const blogQueries = require('../prisma/queries/blogQueries');

// Constants
const ALLOWED_FIELDS = {
    create: ['title', 'content', 'userId', 'isPublic', 'slug'],
    update: ['title', 'content', 'isPublic', 'slug', 'views']
};

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
async function getBlogs(req, res) {
    try {
        const blogs = await blogQueries.getBlogs();
        return res.status(HTTP_STATUS.OK).json({
            message: 'Blogs retrieved successfully',
            data: blogs
        });
    } catch (error) {
        return handleError(res, 'fetching blogs', error);
    }
}

async function getBlogById(req, res) {
    try {
        const { blogId } = req.params;
        const blog = await blogQueries.getBlogById(blogId);
        
        if (!blog) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Blog with ID ${blogId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'Blog retrieved successfully',
            data: blog
        });
    } catch (error) {
        return handleError(res, 'fetching blog', error);
    }
}

async function createBlog(req, res) {
    try {
        const createData = sanitizeData(req.body, ALLOWED_FIELDS.create);
        const blog = await blogQueries.postBlog(createData);
        
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        return handleError(res, 'creating blog', error);
    }
}

async function updateBlog(req, res) {
    try {
        const { blogId } = req.params;
        const updateData = sanitizeData(req.body, ALLOWED_FIELDS.update);
        const updatedBlog = await blogQueries.putBlog(blogId, updateData);
        
        if (!updatedBlog) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Blog with ID ${blogId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        return handleError(res, 'updating blog', error);
    }
}

async function deleteBlog(req, res) {
    try {
        const { blogId } = req.params;
        const deletedBlog = await blogQueries.deleteBlog(blogId);
        
        if (!deletedBlog) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Blog with ID ${blogId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'Blog deleted successfully',
            data: { id: blogId }
        });
    } catch (error) {
        return handleError(res, 'deleting blog', error);
    }
}

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};