import express from "express";
import JobsController from "../../controllers/jobs";
import AuthChecker from "../../middlewares/auth-checker";

const router = express.Router();

router.get("/", AuthChecker.verifyJWT, JobsController.getAll);
router.get("/:id", AuthChecker.verifyJWT, JobsController.getOne);

export = router;
