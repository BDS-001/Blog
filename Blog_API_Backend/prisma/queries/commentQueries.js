const prisma = require('../prismaClient')

async function getComments(options = {}) {
  try {
    const comments = await prisma.comment.findMany({
      where: options,
      include: {
        user: {
          select: { id: true, name: true, username: true }
        },
        blog: {
          select: { id: true, title: true }
        },
        _count: {
          select: { replies: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return comments
  } catch(error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
}

async function getCommentsByBlogId(blogId) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
        parentId: null
      },
      include: {
        user: {
          select: { id: true, name: true, username: true }
        },
        _count: {
          select: { replies: true }
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, username: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return comments
  } catch(error) {
    throw new Error(`Failed to fetch blog comments: ${error.message}`);
  }
}

async function getCommentById(commentId) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId
      },
      include: {
        user: {
          select: { id: true, name: true, username: true }
        },
        blog: {
          select: { id: true, title: true }
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, username: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        parent: {
          select: {
            id: true,
            content: true,
            user: {
              select: { id: true, name: true, username: true }
            }
          }
        }
      }
    });
    return comment
  } catch(error) {
    throw new Error(`Failed to fetch comment: ${error.message}`);
  }
}

async function deleteComment(commentId) {
  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      return null;
    }
    
    const comment = await prisma.comment.update({
      where: {
        id: commentId
      },
      data: {
        content: '[deleted]',
        updatedAt: new Date()
      }
    });
    return comment
  } catch (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}

async function postComment(commentData) {
    try {
        const comment = await prisma.comment.create({
            data: commentData,
            include: {
                user: {
                  select: { id: true, name: true, username: true }
                },
                blog: {
                  select: { id: true, title: true }
                },
                parent: {
                  select: {
                    id: true,
                    content: true,
                    user: {
                      select: { id: true, name: true, username: true }
                    }
                  }
                }
              }
        })
        return comment
    } catch (error) {
        throw new Error(`Failed to create comment: ${error.message}`);
    }
}

async function putComment(commentId, newData) {
    try {
        const comment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                ...newData,
                updatedAt: new Date()
              },
              include: {
                user: {
                  select: { id: true, name: true, username: true }
                },
                blog: {
                  select: { id: true, title: true }
                },
                parent: {
                  select: {
                    id: true,
                    content: true,
                    user: {
                      select: { id: true, name: true, username: true }
                    }
                  }
                }
              }
        })
        return comment
    } catch (error) {
        throw new Error(`Failed to update comment: ${error.message}`);
    }
}

module.exports = {
  getCommentById,
  getComments,
  getCommentsByBlogId,
  deleteComment,
  postComment,
  putComment
}