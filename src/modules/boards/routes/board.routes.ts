import { Router } from 'express';
import * as boardController from '../controllers/board.controller';
import { authMiddleware } from '../../../middlewares/authMiddlewares';

import boardMemberRoutes from "../../boardMembers/routes/boardMember.routes";

const router = Router();

router.use(authMiddleware);

router.post('/', boardController.createBoard);
router.get('/', boardController.listBoards);
router.get('/:id', boardController.getBoard);
router.patch('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

// Nest the board member routes under a specific board
router.use('/:boardId/members', boardMemberRoutes);

export default router;
