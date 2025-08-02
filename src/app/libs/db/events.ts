import { redirect } from "next/navigation";
// app/libs/db/events.ts
import clientPromise from "@/app/libs/mongodb";
import type { Event } from "@/lib/types";

export async function getEvents(): Promise<Event[]> {
  "use server";
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

export async function updateEvent(formData: FormData) {
  "use server";
  try {
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("Event ID is required");

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "Tech";
    const capacityStr = formData.get("capacity")?.toString() || "100";
    const capacity = parseInt(capacityStr, 10);
    const date = formData.get("date")?.toString() || "";
    const time = formData.get("time")?.toString() || "";
    const mode = formData.get("mode")?.toString() || "in-person";
    const location = formData.get("location")?.toString() || "";
    const status = formData.get("status")?.toString() || "upcoming";

    const client = await clientPromise;
    const db = client.db("koders");
    const eventsCollection = db.collection("events");

    await eventsCollection.updateOne(
      { id: id },
      {
        $set: {
          title,
          description,
          category,
          capacity,
          date,
          time,
          mode,
          location,
          status,
        },
      }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
  redirect("/admin/events");
}
