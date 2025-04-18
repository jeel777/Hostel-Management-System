-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('MANAGER', 'CLEANER', 'SECURITY');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "ApprovalEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "room_count" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role" "RoleEnum" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "date_of_join" TIMESTAMP(3) NOT NULL,
    "salary" DECIMAL(65,30) NOT NULL,
    "gender" "GenderEnum" NOT NULL,
    "age" INTEGER NOT NULL,
    "roll_id" INTEGER NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student1" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "GenderEnum" NOT NULL DEFAULT 'MALE',
    "age" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'student',

    CONSTRAINT "Student1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student2" (
    "student1_id" INTEGER NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emergency_number" TEXT NOT NULL,
    "parent_contact" TEXT NOT NULL,
    "roll_number" INTEGER NOT NULL,

    CONSTRAINT "Student2_pkey" PRIMARY KEY ("student1_id")
);

-- CreateTable
CREATE TABLE "College" (
    "roll_number" INTEGER NOT NULL,
    "college_name" TEXT NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("roll_number")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "student1_id" INTEGER NOT NULL,
    "issue" TEXT NOT NULL,
    "room_number" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GatePass" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "leave_date" TIMESTAMP(3) NOT NULL,
    "arrival_date" TIMESTAMP(3) NOT NULL,
    "approval" "ApprovalEnum" NOT NULL,
    "student1_id" INTEGER NOT NULL,

    CONSTRAINT "GatePass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeePayment" (
    "id" SERIAL NOT NULL,
    "semester" INTEGER NOT NULL,
    "date_of_payment" TIMESTAMP(3) NOT NULL,
    "Transaction_id" TEXT NOT NULL,
    "mode_of_payment" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student1_email_key" ON "Student1"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_student_id_key" ON "Room"("student_id");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_roll_id_fkey" FOREIGN KEY ("roll_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student2" ADD CONSTRAINT "Student2_student1_id_fkey" FOREIGN KEY ("student1_id") REFERENCES "Student1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student2" ADD CONSTRAINT "Student2_roll_number_fkey" FOREIGN KEY ("roll_number") REFERENCES "College"("roll_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_student1_id_fkey" FOREIGN KEY ("student1_id") REFERENCES "Student1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatePass" ADD CONSTRAINT "GatePass_student1_id_fkey" FOREIGN KEY ("student1_id") REFERENCES "Student1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
