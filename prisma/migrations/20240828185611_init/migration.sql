-- CreateEnum
CREATE TYPE "MeasureTypes" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Customer" (
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_code")
);

-- CreateTable
CREATE TABLE "Measure" (
    "measure_uuid" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_type" "MeasureTypes" NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_url_expiration" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("measure_uuid")
);

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer"("customer_code") ON DELETE RESTRICT ON UPDATE CASCADE;
