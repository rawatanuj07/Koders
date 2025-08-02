import clientPromise from "@/app/libs/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("koders");
    const bookingsCollection = db.collection("bookings");
    const eventsCollection = db.collection("events"); // for reference, not used directly here (aggregation does it)

    // Aggregate bookings joined with event details
    const userBookings = await bookingsCollection
      .aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "id",
            as: "eventDetails",
          },
        },
        { $unwind: "$eventDetails" },
        {
          $project: {
            _id: 1,
            userId: 1,
            eventId: 1,
            seatsBooked: 1,
            bookingTime: 1,
            status: 1,
            // Include the event fields we want to expose
            eventTitle: "$eventDetails.title",
            eventDate: "$eventDetails.date",
            eventTime: "$eventDetails.time",
            eventLocation: "$eventDetails.location",
          },
        },
      ])
      .toArray();

    // Format the data: map _id to string id
    const bookings = userBookings.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));

    console.log(
      "Fetched bookings for user:",
      userId,
      "count:",
      bookings.length
    );

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
