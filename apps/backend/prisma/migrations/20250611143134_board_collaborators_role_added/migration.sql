-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoardCollaborators" (
    "BoardId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "Role" TEXT NOT NULL DEFAULT 'VIEWER',

    PRIMARY KEY ("BoardId", "UserId"),
    CONSTRAINT "BoardCollaborators_BoardId_fkey" FOREIGN KEY ("BoardId") REFERENCES "Board" ("Id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BoardCollaborators_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("UserId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BoardCollaborators" ("BoardId", "UserId") SELECT "BoardId", "UserId" FROM "BoardCollaborators";
DROP TABLE "BoardCollaborators";
ALTER TABLE "new_BoardCollaborators" RENAME TO "BoardCollaborators";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
