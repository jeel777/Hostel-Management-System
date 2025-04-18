-- CreateTable
CREATE TABLE "MessMenu" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "meal_type" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessMenu_pkey" PRIMARY KEY ("id")
);
