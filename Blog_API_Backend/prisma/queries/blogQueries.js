const prisma = require('../prismaClient')

const userSelect = {
    id: true,
    email: true,
    name: true,
    username: true,
    createdAt: true,
    updatedAt: true,
    roleId: true,
    role: true
  };

async function getBlogs(options = {}) {
  try {
    const blogs = await prisma.blog.findMany({
      where: options,
      include: {
        author: {
          select: userSelect
        },
      },
      orderBy: { createdAt: 'desc' }
    });
    return blogs
  } catch(error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }
}

async function getBlogById(blogId) {
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId,
            },
            include: {
                author: {
                    select: userSelect
                },
                comments: {
                    where: {parentId: null},
                    include: {
                        user: {
                            select: userSelect
                        },
                        replies: {
                            include: {
                                user: {
                                    select: userSelect
                                }
                            }
                        }
                    }
                }
            }
        })
        return blog
    } catch(error) {
        throw new Error(`Failed to fetch blog: ${error.message}`);
    }
}

async function deleteBlog(blogId) {
    try {
        const existingBlog = await prisma.blog.findUnique({
            where: { id: blogId }
        });

        if (!existingBlog) {
            return null; 
        }

        const blog = await prisma.blog.delete({
            where: {
                id: blogId
            }
        });
        return blog
    } catch (error) {
      throw new Error(`Failed to delete blog: ${error.message}`);
    }
  }

  async function postBlog(blogData) {
    try {
        const blog = await prisma.blog.create({
            data: blogData,
            include: {
                author: {
                    select: userSelect
                }
            }
        })
        return blog
    } catch (error) {
        throw new Error(`Failed to create blog: ${error.message}`);
    }
}

async function putBlog(blogId, newData) {
    try {
        const blog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                ...newData,
                updatedAt: new Date()
              },
            include: {
                comments: true,
                author: {
                    select: userSelect
                }
            }
        })
        return blog
    } catch (error) {
        throw new Error(`Failed to update blog: ${error.message}`);
    }
}

module.exports = {
    getBlogs,
    getBlogById,
    deleteBlog,
    postBlog,
    putBlog
}