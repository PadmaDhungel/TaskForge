import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddlewares";
import * as memberService from "../services/boardMember.service";
import { inviteMemberSchema, updateMemberRoleSchema } from "../validators/boardMember.schemas";

export const inviteMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { boardId } = req.params;
        const data = inviteMemberSchema.parse(req.body);
        const inviterId = req.user!.userId;

        const member = await memberService.inviteMember(boardId, inviterId, data);
        res.status(201).json({ member });
    } catch (err) {
        next(err);
    }
};

export const updateMemberRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { boardId, memberId } = req.params;
        const data = updateMemberRoleSchema.parse(req.body);
        const requesterId = req.user!.userId;

        const member = await memberService.updateMemberRole(boardId, memberId, requesterId, data);
        res.json({ member });
    } catch (err) {
        next(err);
    }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { boardId, memberId } = req.params;
        const requesterId = req.user!.userId;

        await memberService.removeMember(boardId, memberId, requesterId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
