-- CreateTable
CREATE TABLE "BoardCollaborators" (
    "BoardId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,

    PRIMARY KEY ("BoardId", "UserId")
);
