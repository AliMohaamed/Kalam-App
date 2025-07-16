import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
        id: true,
        displayName: true,
        image: true,
    }
  });
    res.status(200).json(users);
};

export { getUsers };