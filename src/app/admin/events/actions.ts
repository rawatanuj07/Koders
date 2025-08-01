"use server";
import clientPromise from "@/app/libs/mongodb";
export async function deleteEventById(eventId: string) {
  const client = await clientPromise;
  const db = client.db("koders");
  const eventsCollection = db.collection("events");

  await eventsCollection.deleteOne({ id: eventId });
}
