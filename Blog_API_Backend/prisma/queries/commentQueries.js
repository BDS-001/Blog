const prisma = require('../prismaClient')

async function getComments(options = {}) {
    try {
        const comments = await prisma.comment.findMany({
            where: options,
            include: {
                user: {
                  select: { id: true, name: true }
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

async function getCommentById(commentId) {
    try {
        const comment = await prisma.comment.findUnique({
            where: { 
                id: commentId
            },
            include: {
              user: {
                select: { id: true, name: true }
              },
              blog: {
                select: { id: true, title: true }
              },
              replies: {
                include: {
                  user: {
                    select: { id: true, name: true }
                  }
                }
              },
              parent: {
                select: { 
                  id: true,
                  content: true,
                  user: {
                    select: { id: true, name: true }
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
        const comment = await prisma.comment.delete({
            where: {
                id: commentId
            }
        })
        return comment
    } catch (error) {
        throw new Error(`Failed to delete comment: ${error.message}`);
    }
}

module.exports = {
    getCommentById,
    getComments,
    deleteComment
}