"use server";
import { Attendee } from "@/lib/types";
import { getEvents } from "@/app/libs/db/events";
import clientPromise from "@/app/libs/mongodb";
import AttendeesPageClient from "@/components/AttendeesPageClient";

export default async function AttendeesPage() {
  const events = await getEvents(); // safe server-side DB call
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  // Aggregation to get attendee details per event
  const rawAttendees = await db
    .collection("bookings")
    .aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $lookup: {
          from: "users",
          let: { uId: { $toObjectId: "$userId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$uId"] } } }],
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          eventTitle: "$event.title",
          eventId: "$event.id",
          userName: "$user.username",
          attendeeEmail: "$user.email",
          seats: "$seatsBooked",
          bookingDate: "$bookingTime",
          bookingStatus: "$status",
        },
      },
      { $sort: { EventTitle: 1, BookingDate: 1 } },
    ])
    .toArray();

  const attendees = rawAttendees as Attendee[];

  return <AttendeesPageClient events={events} attendees={attendees} />;
  // return <h1>hellll</h1>;
}
