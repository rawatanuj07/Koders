import { redirect } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import type { Event } from "@/lib/types";
import { generateEventId } from "@/lib/utils";
import clientPromise from "@/app/libs/mongodb"; // Import your MongoDB client

export default function CreateEventPage() {
  // Server Action for form submission (must be async and use "use server" directive)
  async function handleSubmit(formData: FormData) {
    "use server";

    // Extract fields from formData
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "Tech";
    const capacityStr = formData.get("capacity")?.toString() || "100";
    const capacity = parseInt(capacityStr, 10);
    const date = formData.get("date")?.toString() || "";
    const time = formData.get("time")?.toString() || "";
    const mode = formData.get("mode")?.toString() || "in-person";
    const location = formData.get("location")?.toString() || "";

    // Connect to MongoDB
    const client = await clientPromise;
    const database = client.db("koders");
    const eventsCollection = database.collection("events");

    // Create new event object
    const newEvent: Event = {
      id: generateEventId(),
      title,
      description,
      category,
      capacity,
      bookedSeats: 0, // start with zero booked seats
      date,
      time,
      mode: mode as "in-person" | "online",
      location,
      status: "upcoming", // default status
    };

    try {
      // Insert the event document in MongoDB
      const result = await eventsCollection.insertOne(newEvent);

      if (!result.acknowledged) {
        throw new Error("Failed to create event");
      }

      console.log("Event created with id:", result.insertedId);
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }

    // Redirect after successful creation
    redirect("/admin/events");
  }

  return (
    <div>
      {/* Pass server action directly as form action */}
      <EventForm action={handleSubmit} />
    </div>
  );
}
