import { Router } from "express";
import { signIn, signUp,createFeePayment,createFeedback,createGatePass,getAllGatePasses,getAllFeedback,updateGatePassStatus, getStudentGatePasses, assignStudentsToRoom, getAdminRoomCount, createMessMenu, getMessMenu, getRoomAssignments } from "../AuthController/page.js"; // Add `.js` extension
import { completeProfile } from "../AuthController/page.js";
import authMiddleware from "../Authmiddleware/page.js";
import { addStaff } from "../AuthController/page.js"; // Add `.js` extension
import { getAllStaff } from "../AuthController/page.js"; // Add `.js` extension
import { removeStaff } from "../AuthController/page.js"; // Add `.js` extension

import { addCommitteeMember } from "../AuthController/page.js"; // Add `.js` extension
import { getCommitteeMembers } from "../AuthController/page.js"; // Add `.js` extension
import { removeCommitteeMember } from "../AuthController/page.js"; // Add `.js` extension
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
router.get("/roomAssignments", getRoomAssignments);


router.post("/addStaff",addStaff);
router.get('/seeStaff', getAllStaff);
router.delete('/removeStaff/:staffId', removeStaff);
router.post('/addCommitteeMember', addCommitteeMember);
router.get('/getCommitteeMembers', getCommitteeMembers);
router.delete('/removeCommitteeMember/:id', removeCommitteeMember);

export default router;
