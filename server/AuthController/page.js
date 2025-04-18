import prisma from "../config/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Ensure you set this in your .env file

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        // Check if user already exists
        const existingUser = await prisma.student1.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.student1.create({
            data: {
                name,
                email,
                password: hashedPassword,
                 // Ensure default values if needed
            },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",

        });
        res.status(201).json({ message: "User registered successfully", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        // Check if user exists in admin table
        let user = await prisma.admin.findUnique({ where: { email } });
        let isAdmin = true;

        // If not in admin table, check student1 table
        if (!user) {
            user = await prisma.student1.findUnique({ where: { email } });
            isAdmin = false;
        }

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Verify password
        let isValidPassword;
        if(isAdmin){
             isValidPassword = password === "admin";
        }
        else{
             isValidPassword = await bcrypt.compare(password, user.password);
        }
        if (!isValidPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, isAdmin }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ 
            message: "Login successful", 
            token,
            user: {
                ...user,
                isAdmin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const completeProfile = async (req, res) => {
    try {
        const { email, gender, age, mobile_number, address, emergency_number, parent_contact, roll_number, college_name } = req.body;

        if (!email || !gender || !age || !mobile_number || !address || !emergency_number || !parent_contact || !roll_number || !college_name) {
            return res.status(400).json({ error: "Please fill all required fields" });
        }

        // Convert roll_number to integer
        const rollNumberInt = parseInt(roll_number);
        if (isNaN(rollNumberInt)) {
            return res.status(400).json({ error: "Invalid roll number format" });
        }

        // Convert gender to Prisma Enum format
        const validGenders = ["Male", "Female", "Other"];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ error: "Invalid gender value" });
        }

        // Fetch student from DB using email
        const student1 = await prisma.student1.findUnique({ where: { email } });
        if (!student1) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Update Student1 details
        const updatedStudent1 = await prisma.student1.update({
            where: { email },
            data: { gender: gender.toUpperCase(), age: parseInt(age) } // Convert age to integer
        });

        // Check if College exists, if not, create it
        let college = await prisma.college.findUnique({ where: { roll_number: rollNumberInt } });
        if (!college) {
            college = await prisma.college.create({
                data: { roll_number: rollNumberInt, college_name }
            });
        }

        // Check if Student2 exists, if not, create it
        let student2 = await prisma.student2.findUnique({ where: { student1_id: student1.id } });
        if (!student2) {
            student2 = await prisma.student2.create({
                data: {
                    student1_id: student1.id,
                    mobile_number,
                    address,
                    emergency_number,
                    parent_contact,
                    roll_number: rollNumberInt,
                },
            });
        } else {
            // Update Student2 details if already exists
            student2 = await prisma.student2.update({
                where: { student1_id: student1.id },
                data: { mobile_number, address, emergency_number, parent_contact, roll_number: rollNumberInt },
            });
        }

        return res.status(200).json({ message: "Profile updated successfully", student1: updatedStudent1, student2 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const createFeedback = async (req, res) => {
    try {
        const { student1_id, issue, room_number } = req.body;
        
        if (!issue || !room_number) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const feedback = await prisma.feedback.create({
            data: { student1_id, issue, room_number }
        });

        return res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createGatePass = async (req, res) => {
    try {
        const { student1_id, reason, leave_date, arrival_date, approval } = req.body;
       
        if (!reason || !leave_date || !arrival_date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const gatePass = await prisma.gatePass.create({
            data: {
                student1_id,
                reason,
                leave_date: new Date(leave_date),
                arrival_date: new Date(arrival_date),
                approval: approval || "PENDING",
            }
        });
        return res.status(201).json({ message: "Gate pass request created", gatePass });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const createFeePayment = async (req, res) => {
    try {
        let { student_id, semester, date_of_payment,  mode_of_payment } = req.body;

        // Convert student_id and semester to integers
        student_id = parseInt(student_id, 10);
        semester = parseInt(semester, 10);

        if (isNaN(student_id) || isNaN(semester)) {
            return res.status(400).json({ error: "Invalid student ID or semester" });
        }

        // Create fee payment record
        const feePayment = await prisma.feePayment.create({
            data: {
                student_id,
                semester,
                date_of_payment: new Date(date_of_payment),
                mode_of_payment
            },
        });

        res.status(201).json({ message: "Fee payment recorded successfully", feePayment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllGatePasses = async (req, res) => {
    try {
        const gatePasses = await prisma.gatePass.findMany({
            include: {
                student: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(gatePasses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateGatePassStatus = async (req, res) => {
    try {
        const { id, approval } = req.body;

        if (!id || !approval) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedGatePass = await prisma.gatePass.update({
            where: { id: parseInt(id) },
            data: { approval }
        });

        return res.status(200).json(updatedGatePass);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await prisma.feedback.findMany({
            include: {
                student: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};






