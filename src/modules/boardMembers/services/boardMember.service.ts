import prisma, { BoardRole } from "../../../db";
import { InviteMemberInput, UpdateMemberRoleInput } from "../validators/boardMember.schemas";
import { ForbiddenError, NotFoundError } from "../../../errors";

export const inviteMember = async (boardId: string, inviterId: string, data: InviteMemberInput) => {
    // Check inviter is owner
    const inviter = await prisma.boardMember.findFirst({
        where: { boardId, userId: inviterId, role: BoardRole.OWNER },
    });
    if (!inviter) throw new ForbiddenError("Only owners can invite members");

    // Ensure invited user exists
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new NotFoundError("User not found");

    return await prisma.boardMember.create({
        data: {
            boardId,
            userId: data.userId,
            role: data.role,
        },
    });
};

export const updateMemberRole = async (
    boardId: string,
    memberId: string,
    requesterId: string,
    data: UpdateMemberRoleInput
) => {
    const requester = await prisma.boardMember.findFirst({
        where: { boardId, userId: requesterId, role: BoardRole.OWNER },
    });
    if (!requester) throw new ForbiddenError("Only owners can update roles");

    return await prisma.boardMember.update({
        where: { id: memberId },
        data: { role: data.role },
    });
};

export const removeMember = async (boardId: string, memberId: string, requesterId: string) => {
    const requester = await prisma.boardMember.findFirst({
        where: { boardId, userId: requesterId, role: BoardRole.OWNER },
    });
    if (!requester) throw new ForbiddenError("Only owners can remove members");

    return await prisma.boardMember.delete({
        where: { id: memberId },
    });
};
