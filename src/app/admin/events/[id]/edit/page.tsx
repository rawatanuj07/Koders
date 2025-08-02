// app/admin/events/[id]/edit/page.tsx
import clientPromise from "@/app/libs/mongodb";
import { EventForm } from "@/components/EventForm";
import type { Event } from "@/lib/types";
import { redirect } from "next/navigation";
import { updateEvent } from "@/app/libs/db/events"; // Import the server action
interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  console.log("Editing event with ID:", typeof id);
  const client = await clientPromise;
  const db = client.db("koders");
  const eventsCollection = db.collection<Event>("events");

  // Validate ObjectId or return redirect if invalid
  let event;
  try {
    console.log("Editing event with ID:", id);

    event = await eventsCollection.findOne({ id });
    console.log("Fetched event:", event);
  } catch {
    redirect("/admin/events");
    return null;
  }

  if (!event) {
    redirect("/admin/events");
    return null;
  }

  const eventData = JSON.parse(
    JSON.stringify({
      ...event,
      id: event.id || event._id.toString(),
    })
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Edit Event</h1>
      {/* Pass event data and update action */}
      <EventForm event={eventData} isEditing action={updateEvent} />
    </div>
  );
}

// Server Action for updating existing event
// async function updateEvent(formData: FormData) {
//   "use server";
//   try {
//     const id = formData.get("id")?.toString();
//     if (!id) throw new Error("Event ID is required");

//     const title = formData.get("title")?.toString() || "";
//     const description = formData.get("description")?.toString() || "";
//     const category = formData.get("category")?.toString() || "Tech";
//     const capacityStr = formData.get("capacity")?.toString() || "100";
//     const capacity = parseInt(capacityStr, 10);
//     const date = formData.get("date")?.toString() || "";
//     const time = formData.get("time")?.toString() || "";
//     const mode = formData.get("mode")?.toString() || "in-person";
//     const location = formData.get("location")?.toString() || "";
//     const status = formData.get("status")?.toString() || "upcoming";

//     const client = await clientPromise;
//     const db = client.db("koders");
//     const eventsCollection = db.collection("events");

//     await eventsCollection.updateOne(
//       { id: id },
//       {
//         $set: {
//           title,
//           description,
//           category,
//           capacity,
//           date,
//           time,
//           mode,
//           location,
//           status,
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error updating event:", error);
//     throw new Error("Failed to update event");
//   }
//   redirect("/admin/events");
// }
