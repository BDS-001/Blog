const prisma = require('../prismaClient')

async function getBlogs(options = {}) {
  try {
    const blogs = await prisma.blog.findMany({
      where: options,
      include: {
        author: {
          select: { password: false }
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
                    select: { password: false }
                },
                comments: {
                    where: {parentId: null},
                    include: {
                        user: {
                            select: {password: false}
                        },
                        replies: {
                            include: {
                                user: {
                                    select: {password: false}
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

module.exports = {
    getBlogs,
    getBlogById
}