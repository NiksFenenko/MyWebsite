import { Router } from "express";
import { syncUser } from "../controllers/userControler";
import { requireAuth } from "@clerk/express";

const router = Router();


// POST /api/users/sync => sync user data from Clerk to our database
router.post("/sync",requireAuth(), syncUser);

export default router;