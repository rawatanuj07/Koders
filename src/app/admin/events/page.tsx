"use server";
import { getEvents } from "@/app/libs/db/events";
import AdminEventsPageClient from "@/components/AdminEventsPageClient";
import clientPromise from "@/app/libs/mongodb";
export default async function AdminEventsPage() {
  const events = await getEvents(); // safe server-side DB call
  return (
    <AdminEventsPageClient
      initialEvents={events}
      deleteEvent={deleteEventById}
    />
  );
}

export async function deleteEventById(eventId: string) {
  const client = await clientPromise;
  const db = client.db("koders");
  const eventsCollection = db.collection("events");

  await eventsCollection.deleteOne({ id: eventId });
}
