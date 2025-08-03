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
    const allowedStatuses = ["confirmed", "pending", "rescheduled"]; // define statuses that count towards seat limit

    const client = await clientPromise;
    const db = client.db("koders");
    const eventsCollection = db.collection("events");
    const bookingsCollection = db.collection("bookings");

    // 1. Aggregation: sum booked seats of current user for this event with allowed statuses
    const aggregationResult = await bookingsCollection
      .aggregate([
        {
          $match: {
            eventId,
            userId,
            status: { $in: allowedStatuses },
          },
        },
        {
          $group: {
            _id: null,
            totalSeatsBooked: { $sum: "$seatsBooked" },
          },
        },
      ])
      .toArray();

    const seatsAlreadyBooked = aggregationResult[0]?.totalSeatsBooked || 0;

    if (seatsAlreadyBooked + seatsBooked > 2) {
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

    // 3. Increment bookedSeats atomically (safe concurrency)
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

    // 4. Insert or update booking
    const existingBooking = await bookingsCollection.findOne({
      eventId,
      userId,
      status: { $in: allowedStatuses },
    });

    if (existingBooking) {
      // Update existing booking seats and time
      await bookingsCollection.updateOne(
        { _id: existingBooking._id },
        {
          $inc: { seatsBooked: seatsBooked },
          $set: { bookingTime: new Date() },
        }
      );
    } else {
      // Insert new booking document
      await bookingsCollection.insertOne({
        eventId,
        userId,
        seatsBooked,
        bookingTime: new Date(),
        status: "confirmed",
      });
    }

    console.log(
      `[Booking Log] User: ${userId} booked ${seatsBooked} seat(s) for ${eventId} at ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      bookedSeats: seatsAlreadyBooked + seatsBooked,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
