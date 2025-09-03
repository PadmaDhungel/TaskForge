import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddlewares";
import * as memberController from "../controllers/boardMember.controller";

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post("/", memberController.inviteMember);
router.patch("/:memberId", memberController.updateMemberRole);
router.delete("/:memberId", memberController.removeMember);

export default router;
