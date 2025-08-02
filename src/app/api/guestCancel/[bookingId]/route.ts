import clientPromise from "@/app/libs/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const resolvedParams = await params; // Await params here
    const { bookingId } = resolvedParams;

    console.log("bookingId", bookingId);

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("koders");
    const bookingsCollection = db.collection("bookings");
    const eventsCollection = db.collection("events");

    // Convert bookingId to ObjectId safely
    let bookingObjectId;
    try {
      bookingObjectId = new ObjectId(bookingId);
    } catch {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // Find the booking to get eventId and seatsBooked
    const booking = await bookingsCollection.findOne({ _id: bookingObjectId });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const updateResult = await bookingsCollection.updateOne(
      { _id: bookingObjectId },
      { $set: { status: "cancelled" } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to cancel booking" },
        { status: 500 }
      );
    }

    // Decrement bookedSeats in the event document by seatsBooked
    await eventsCollection.updateOne(
      { id: booking.eventId },
      { $inc: { bookedSeats: -booking.seatsBooked } }
    );

    return NextResponse.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
