/*
  Warnings:

  - You are about to drop the column `publicId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `imagePublicId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "publicId",
ADD COLUMN     "imagePublicId" TEXT NOT NULL;
