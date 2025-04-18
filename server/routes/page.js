import { Router } from "express";
import { signIn, signUp,createFeePayment,createFeedback,createGatePass,getAllGatePasses,getAllFeedback,updateGatePassStatus } from "../AuthController/page.js"; // Add `.js` extension
import { completeProfile } from "../AuthController/page.js";
import authMiddleware from "../Authmiddleware/page.js";
const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/completeProfile", completeProfile);
router.post("/createFeedback",  createFeedback);
router.post("/createGatePass", createGatePass);
router.post("/createFeePayment", createFeePayment);
router.get("/getAllGatePasses", getAllGatePasses);
router.post("/updateGatePassStatus", updateGatePassStatus);
router.get("/getAllFeedback", getAllFeedback);

export default router;
