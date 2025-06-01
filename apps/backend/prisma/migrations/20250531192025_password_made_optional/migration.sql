-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "UserId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Email" TEXT NOT NULL,
    "Provider" TEXT NOT NULL,
    "OAuthId" TEXT,
    "FullName" TEXT NOT NULL,
    "Password" TEXT,
    "PictureUrl" TEXT
);
INSERT INTO "new_User" ("Email", "FullName", "OAuthId", "Password", "PictureUrl", "Provider", "UserId") SELECT "Email", "FullName", "OAuthId", "Password", "PictureUrl", "Provider", "UserId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
