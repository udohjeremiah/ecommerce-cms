/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Billboard` table. All the data in the column will be lost.
  - Added the required column `imagePublicId` to the `Billboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Billboard" DROP COLUMN "imageUrl",
ADD COLUMN     "imagePublicId" TEXT NOT NULL;
