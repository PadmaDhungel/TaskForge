import { Request, Response, NextFunction } from 'express';
import { createBoardSchema, updateBoardSchema } from '../validators/board.schemas';
import * as boardService from '../services/board.service';
import { AuthRequest } from '../../../middlewares/authMiddlewares';

export const createBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const data = createBoardSchema.parse(req.body);
        const userId = req.user!.userId;

        const board = await boardService.createBoard(userId, data);
        res.status(201).json({ board });
    } catch (err) {
        next(err);
    }
};

export const listBoards = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const boards = await boardService.getBoardsForUser(userId);
        res.json({ boards });
    } catch (err) {
        next(err);
    }
};

export const getBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const board = await boardService.getBoardById(id, userId);
        if (!board) {
            return res.status(404).json({ error: 'Board not found or access denied' });
        }
        res.json({ board });
    } catch (err) {
        next(err);
    }
};

export const updateBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = updateBoardSchema.parse(req.body);
        const userId = req.user!.userId;

        const board = await boardService.updateBoard(id, userId, data);
        res.json({ board });
    } catch (err) {
        next(err);
    }
};

export const deleteBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        await boardService.deleteBoard(id, userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
