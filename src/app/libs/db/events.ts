// app/libs/db/events.ts
import clientPromise from "@/app/libs/mongodb";
import type { Event } from "@/lib/types";

export async function getEvents(): Promise<Event[]> {
  const client = await clientPromise;
  const database = client.db("koders");
  const eventsCollection = database.collection<Event>("events");

  // Fetch all events, or you can add sorting/filters here
  const events = await eventsCollection.find({}).toArray();
  // Convert MongoDB documents (if any _id) or other fields as needed
  // For example, if _id is in MongoDB docs, convert it to string or remove it

  return events.map(({ _id, ...rest }) => ({
    ...rest,
    id: rest.id || _id.toString(), // fallback to _id string if no id field
  }));
}
