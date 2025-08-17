import prisma from '../../../db';
import { CreateBoardInput, UpdateBoardInput } from '../validators/board.schemas';

export const createBoard = async (userId: string, data: CreateBoardInput) => {
    return prisma.board.create({
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
    return prisma.board.findMany({
        where: {
            members: { some: { userId } },
        },
        include: { members: true },
    });
};

export const getBoardById = async (boardId: string, userId: string) => {
    return prisma.board.findFirst({
        where: {
            id: boardId,
            members: { some: { userId } },
        },
        include: { members: true },
    });
};

export const updateBoard = async (
    boardId: string,
    userId: string,
    data: UpdateBoardInput
) => {
    const member = await prisma.boardMember.findFirst({
        where: { boardId, userId },
    });
    if (!member) {
        throw new Error('Not authorized to update this board');
    }

    return prisma.board.update({
        where: { id: boardId },
        data,
        include: { members: true },
    });
};

export const deleteBoard = async (boardId: string, userId: string) => {
    const member = await prisma.boardMember.findFirst({
        where: { boardId, userId, role: 'owner' },
    });
    if (!member) {
        throw new Error('Only board owners can delete the board');
    }

    return prisma.board.delete({
        where: { id: boardId },
    });
};
