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

        if (!student1_id || !issue || !room_number) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🔍 Check if student exists
        const student = await prisma.student1.findUnique({
            where: { id: parseInt(student1_id) },
        });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const feedback = await prisma.feedback.create({
            data: { 
                student1_id: student.id, 
                issue, 
                room_number 
            }
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


export const getStudentGatePasses = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        const gatePasses = await prisma.gatePass.findMany({
            where: {
                student1_id: parseInt(studentId)
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
      
export const addStaff = async (req, res) => {
    try {
        const { name, contact_number, date_of_join, salary, gender, age, role } = req.body;

        // Validate input
        if (!name || !contact_number || !date_of_join || !salary || !gender || !age || !role) {
            return res.status(400).json({ error: "Please fill all required fields." });
        }

        // Validate gender enum
        const validGenders = ["MALE", "FEMALE", "OTHER"];
        if (!validGenders.includes(gender.toUpperCase())) {
            return res.status(400).json({ error: "Invalid gender value." });
        }

        // Validate role enum
        const validRoles = ["MANAGER", "CLEANER", "SECURITY"];
        if (!validRoles.includes(role.toUpperCase())) {
            return res.status(400).json({ error: "Invalid role value." });
        }

        // Check if role already exists, otherwise create it
        let roleRecord = await prisma.role.findFirst({
            where: { role: role.toUpperCase() }
        });

        if (!roleRecord) {
            roleRecord = await prisma.role.create({
                data: {
                    role: role.toUpperCase()
                }
            });
        }

        // Create staff
        const newStaff = await prisma.staff.create({
            data: {
                name,
                contact_number,
                date_of_join: new Date(date_of_join),
                salary: parseFloat(salary),
                gender: gender.toUpperCase(),
                age: parseInt(age),
                roll_id: roleRecord.role_id
            },
            include: {
                role: true
            }
        });

        return res.status(201).json({ message: "Staff added successfully", staff: newStaff });
    } catch (error) {
        console.error("Error adding staff:", error);

        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const assignStudentsToRoom = async (req, res) => {
    try {
        const { room_id, student_emails } = req.body;
        
        if (!room_id || !student_emails || !Array.isArray(student_emails)) {
            return res.status(400).json({ error: "Room ID and student emails are required" });
        }

        // Get admin's room count limit
        const admin = await prisma.admin.findFirst();
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Check if the number of students exceeds the room count limit
        if (student_emails.length > admin.room_count) {
            return res.status(400).json({ 
                error: `Cannot assign more than ${admin.room_count} students to a room` 
            });
        }

        // Find students by email and get their IDs
        const students = await prisma.student1.findMany({
            where: {
                email: {
                    in: student_emails
                }
            },
            select: {
                id: true,
                email: true
            }
        });

        // Check if all emails were found
        if (students.length !== student_emails.length) {
            const foundEmails = students.map(s => s.email);
            const missingEmails = student_emails.filter(email => !foundEmails.includes(email));
            return res.status(400).json({ 
                error: `Some student emails not found: ${missingEmails.join(', ')}` 
            });
        }
        const existingAssignments = await prisma.room.findMany({
            where: {
                student_id: {
                    in: students.map(s => s.id)
                }
            }
        });

        if (existingAssignments.length > 0) {
            const assignedEmails = students
                .filter(s => existingAssignments.some(a => a.student_id === s.id))
                .map(s => s.email);
            return res.status(400).json({ 
                error: `Some students are already assigned to rooms: ${assignedEmails.join(', ')}` 
            });
        }

        // Create room assignments
        const assignments = await Promise.all(
            students.map(student => 
                prisma.room.create({
                    data: {
                        room_id,
                        student_id: student.id
                    }
                })
            )
        );

        return res.status(201).json({ 
            message: "Students assigned to room successfully",
            assignments
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllStaff = async (req, res) => {
    try {
        // Fetch all staff records
        const staff = await prisma.staff.findMany({
            include: {
                role: true,  // To include the role of the staff
            }
        });

        // Send the staff data as a response
        res.status(200).json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch staff data' });
    }
};

export const removeStaff = async (req, res) => {
    const { staffId } = req.params; // Get staff ID from the URL

    try {
        // Fetch the staff member by ID
        const staffMember = await prisma.staff.findUnique({
            where: {
                id: parseInt(staffId) // Make sure to convert to integer if needed
            }
        });

        if (!staffMember) {
            return res.status(404).json({ error: 'Staff member not found' });
        }

        // Delete the staff member
        await prisma.staff.delete({
            where: {
                id: parseInt(staffId)
            }
        });

        res.status(200).json({ message: 'Staff member removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the staff member' });
    }
};

export const addCommitteeMember = async (req, res) => {
    try {
        const { name, position, contact_number, date_of_join, email, gender } = req.body;

        const newMember = await prisma.hostelCommittee.create({
            data: {
                name,
                position,
                contact_number,
                date_of_join: new Date(date_of_join),
                email,
                gender
            }
        });

        res.status(201).json(newMember);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add committee member' });
    }
};

export const getCommitteeMembers = async (req, res) => {
    try {
        const members = await prisma.hostelCommittee.findMany({
            orderBy: {
                date_of_join: 'asc'
            }
        });
        res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch committee members' });
    }
};

export const removeCommitteeMember = async (req, res) => {
    const { id } = req.params;

    try {
        const existingMember = await prisma.hostelCommittee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingMember) {
            return res.status(404).json({ error: 'Committee member not found' });
        }

        await prisma.hostelCommittee.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Committee member removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove committee member' });
    }
};




export const getAdminRoomCount = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst();
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        return res.status(200).json({ room_count: admin.room_count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createMessMenu = async (req, res) => {
    try {
        const { day, meal_type, items } = req.body;
        
        if (!day || !meal_type || !items) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const validMealTypes = ["Breakfast", "Lunch", "Hi-Tea", "Dinner"];

        if (!validDays.includes(day)) {
            return res.status(400).json({ error: "Invalid day" });
        }

        if (!validMealTypes.includes(meal_type)) {
            return res.status(400).json({ error: "Invalid meal type" });
        }

        const messMenu = await prisma.messMenu.create({
            data: {
                day,
                meal_type,
                items
            }
        });

        return res.status(201).json({ message: "Menu item added successfully", messMenu });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessMenu = async (req, res) => {
    try {
        const messMenu = await prisma.messMenu.findMany({
            orderBy: [
                { day: 'asc' },
                { meal_type: 'asc' }
            ]
        });

        // Group menu items by day and meal type
        const groupedMenu = {};
        messMenu.forEach(item => {
            if (!groupedMenu[item.day]) {
                groupedMenu[item.day] = {};
            }
            groupedMenu[item.day][item.meal_type] = item.items.split(',').map(item => item.trim());
        });

        return res.status(200).json(groupedMenu);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getRoomAssignments = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                student: {
                    include: {
                        student2: true
                    }
                }
            }
        });

        // Group rooms by room_id
        const groupedRooms = rooms.reduce((acc, room) => {
            if (!acc[room.room_id]) {
                acc[room.room_id] = {
                    room_id: room.room_id,
                    students: []
                };
            }
            
            if (room.student) {
                acc[room.room_id].students.push({
                    name: room.student.name,
                    email: room.student.email,
                    mobile_number: room.student.student2?.mobile_number,
                    address: room.student.student2?.address,
                    emergency_number: room.student.student2?.emergency_number,
                    parent_contact: room.student.student2?.parent_contact
                });
            }
            
            return acc;
        }, {});

        // Convert the grouped object to an array
        const formattedRooms = Object.values(groupedRooms);

        return res.status(200).json(formattedRooms);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



