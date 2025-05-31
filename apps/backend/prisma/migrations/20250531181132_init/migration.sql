-- CreateTable
CREATE TABLE "User" (
    "UserId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Email" TEXT NOT NULL,
    "Provider" TEXT NOT NULL,
    "OAuthId" TEXT,
    "FullName" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "PictureUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
