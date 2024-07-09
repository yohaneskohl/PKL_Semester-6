-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('transaction', 'promo', 'general');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('ADULT', 'CHILD', 'BABY');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "family_name" TEXT,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "identity_type" TEXT,
    "identity_number" TEXT,
    "nationality" TEXT,
    "email_isverified" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "booking_code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "expired_paid" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "booking_tax" DOUBLE PRECISION NOT NULL,
    "donation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "url_payment" TEXT,
    "departure_ticket_id" INTEGER NOT NULL,
    "return_ticket_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "is_round_trip" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType",
    "created_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "booking_id" INTEGER,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "booking_id" INTEGER NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "flight_number" TEXT NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "count" INTEGER,
    "departure_airport_id" INTEGER NOT NULL,
    "arrival_airport_id" INTEGER NOT NULL,
    "airplane_id" INTEGER,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "continent" TEXT,
    "image_url" TEXT,
    "city_iata" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "airport_code" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airplanes" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "passenger_capacity" INTEGER NOT NULL,
    "baggage_capacity" INTEGER NOT NULL,
    "cabin_capacity" INTEGER NOT NULL,
    "in_flight_facility" TEXT NOT NULL,
    "airline_id" INTEGER NOT NULL,

    CONSTRAINT "airplanes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "airline_iata" TEXT NOT NULL,
    "logo_url" TEXT,
    "logo_id" TEXT,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airplane_seat_class" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "total_seat" INTEGER NOT NULL,
    "airplane_id" INTEGER NOT NULL,

    CONSTRAINT "airplane_seat_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "airplane_seat_class_id" INTEGER NOT NULL,
    "promo_id" INTEGER,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "family_name" TEXT,
    "birth_date" DATE NOT NULL,
    "nationality" TEXT NOT NULL,
    "identity_type" TEXT,
    "issuing_country" TEXT,
    "identity_number" TEXT,
    "expired_date" TIMESTAMP(3),
    "age_group" "AgeGroup" NOT NULL,
    "booking_id" INTEGER NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otp_user_id_key" ON "otp"("user_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_departure_ticket_id_fkey" FOREIGN KEY ("departure_ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_return_ticket_id_fkey" FOREIGN KEY ("return_ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_departure_airport_id_fkey" FOREIGN KEY ("departure_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_arrival_airport_id_fkey" FOREIGN KEY ("arrival_airport_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "airplanes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airports" ADD CONSTRAINT "airports_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airplanes" ADD CONSTRAINT "airplanes_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airplane_seat_class" ADD CONSTRAINT "airplane_seat_class_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "airplanes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_airplane_seat_class_id_fkey" FOREIGN KEY ("airplane_seat_class_id") REFERENCES "airplane_seat_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
