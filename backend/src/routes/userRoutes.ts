import { Router } from "express";
import { syncUser } from "../controllers/userControler";
import { requireAuth } from "@clerk/express";

const router = Router();

// /api/user/sync -POST => sync user data from clerk to our database
router.post("/sync",requireAuth(), syncUser);

export default router;