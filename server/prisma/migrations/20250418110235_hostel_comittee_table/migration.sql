-- CreateTable
CREATE TABLE "HostelCommittee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "date_of_join" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "gender" "GenderEnum" NOT NULL,

    CONSTRAINT "HostelCommittee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostelCommittee_email_key" ON "HostelCommittee"("email");
