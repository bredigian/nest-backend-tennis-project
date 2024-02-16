/*
  Warnings:

  - Added the required column `payment_link` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `payment_link` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `unit_price` DOUBLE NOT NULL,
    ALTER COLUMN `created_at` DROP DEFAULT;
