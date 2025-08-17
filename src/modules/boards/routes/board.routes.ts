import { Router } from 'express';
import * as boardController from '../controllers/board.controller';
import { authMiddleware } from '../../../middlewares/authMiddlewares';

const router = Router();

router.use(authMiddleware);

router.post('/', boardController.createBoard);
router.get('/', boardController.listBoards);
router.get('/:id', boardController.getBoard);
router.patch('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

export default router;
