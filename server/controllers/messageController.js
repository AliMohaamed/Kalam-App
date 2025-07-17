import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @desc    Get messages for a conversation
// @route   GET /api/messages/:otherUserId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const senderId = req.user.id; // From protect middleware

    // Find the conversation between the logged-in user and the other user
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: senderId } } },
          { participants: { some: { userId: otherUserId } } },
        ],
      },
      include: {
        // Include all messages in that conversation
        messages: {
          orderBy: {
            createdAt: 'asc', // Order messages by creation time
          },
        },
      },
    });

    if (!conversation) {
      // If no conversation exists, return an empty array
      return res.json([]);
    }

    // Return the messages from the conversation
    res.json(conversation.messages);
  } catch (error) {
    console.error('Error in getMessages controller:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};