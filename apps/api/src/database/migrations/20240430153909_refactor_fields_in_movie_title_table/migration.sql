/*
  Warnings:

  - The primary key for the `movie_titles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `movie_title_id` on the `movie_titles` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `movie_titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `movie_titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movie_titles" DROP CONSTRAINT "movie_titles_pkey",
DROP COLUMN "movie_title_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "movie_titles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "User";
