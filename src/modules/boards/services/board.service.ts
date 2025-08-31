import prisma from '../../../db';
import { CreateBoardInput, UpdateBoardInput } from '../validators/board.schemas';
import { ForbiddenError, NotFoundError } from '../../../errors';
export const createBoard = async (userId: string, data: CreateBoardInput) => {
    return await prisma.board.create({
        data: {
            name: data.name,
            description: data.description,
            members: {
                create: {
                    userId,
                    role: 'owner', // default owner
                },
            },
        },
        include: { members: true },
    });
};

export const getBoardsForUser = async (userId: string) => {
    return await prisma.board.findMany({
        where: {
            members: { some: { userId } },
        },
        include: { members: true },
    });
};

export const getBoardById = async (boardId: string, userId: string) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { members: true },
    })
    if (!board) {
        throw new NotFoundError("Board not found")
    }
    const isMember = board.members.some(m => m.userId === userId);
    if (!isMember) {
        throw new ForbiddenError("You are not a member of this board");
    }
    return board;
};

export const updateBoard = async (boardId: string, userId: string, data: UpdateBoardInput
) => {
    const member = await prisma.boardMember.findFirst({
        where: { boardId, userId },
    });
    if (!member) {
        throw new ForbiddenError('Not authorized to update this board');
    }

    return await prisma.board.update({
        where: { id: boardId },
        data,
        include: { members: true },
    });
};

export const deleteBoard = async (boardId: string, userId: string) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { members: true },
    });

    if (!board) {
        throw new NotFoundError("Board not found");
    }

    const member = await prisma.boardMember.findFirst({
        where: { boardId, userId, role: 'owner' },
    });
    if (!member) {
        throw new ForbiddenError('Only board owners can delete the board');
    }
    // Delete all BoardMember records linked to this board
    await prisma.boardMember.deleteMany({
        where: { boardId },
    });

    // Then delete the board itself
    return await prisma.board.delete({
        where: { id: boardId },
    });

};
