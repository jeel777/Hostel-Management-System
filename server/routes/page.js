import { Router } from "express";
import { signIn, signUp,createFeePayment,createFeedback,createGatePass,getAllGatePasses,getAllFeedback,updateGatePassStatus, getStudentGatePasses, assignStudentsToRoom, getAdminRoomCount, createMessMenu, getMessMenu } from "../AuthController/page.js"; // Add `.js` extension
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
router.get("/gatepass/student/:studentId", getStudentGatePasses);
router.post("/updateGatePassStatus", updateGatePassStatus);
router.get("/getAllFeedback", getAllFeedback);
router.post("/assignStudentsToRoom", assignStudentsToRoom);
router.get("/getAdminRoomCount", getAdminRoomCount);
router.post("/messMenu", createMessMenu);
router.get("/messMenu", getMessMenu);

export default router;
