// app/api/bookEvent/route.ts
import clientPromise from "@/app/libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { eventId, userId, seatsBooked = 1 } = await request.json();

  if (!eventId || !userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (seatsBooked < 1 || seatsBooked > 2) {
    return NextResponse.json(
      { error: "Can book 1 or 2 seats only" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("koders");
    const eventsCollection = db.collection("events");
    const bookingsCollection = db.collection("bookings");

    // 1. Check existing user bookings
    const existingBooking = await bookingsCollection.findOne({
      eventId,
      userId,
    });
    const previousSeats = existingBooking?.seatsBooked || 0;
    if (previousSeats + seatsBooked > 2) {
      return NextResponse.json(
        { error: "Cannot book more than 2 seats per event" },
        { status: 400 }
      );
    }

    // 2. Check event capacity
    const event = await eventsCollection.findOne({ id: eventId });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (event.bookedSeats + seatsBooked > event.capacity) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 409 }
      );
    }

    // 3. Increment bookedSeats atomically
    const updateResult = await eventsCollection.updateOne(
      { id: eventId, bookedSeats: { $lte: event.capacity - seatsBooked } },
      { $inc: { bookedSeats: seatsBooked } }
    );
    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update event seats" },
        { status: 500 }
      );
    }

    // 4. Insert or update booking for user
    if (existingBooking) {
      await bookingsCollection.updateOne(
        { eventId, userId },
        {
          $inc: { seatsBooked: seatsBooked },
          $set: { bookingTime: new Date() },
        }
      );
    } else {
      await bookingsCollection.insertOne({
        eventId,
        userId,
        seatsBooked,
        bookingTime: new Date(),
        status: "confirmed",
      });
    }

    // 5. Log booking info (simulating middleware)
    console.log(
      `[Booking Log] User: ${userId} booked ${seatsBooked} seat(s) for ${eventId} at ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      bookedSeats: previousSeats + seatsBooked,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
