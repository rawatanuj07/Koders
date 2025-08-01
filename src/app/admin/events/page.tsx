"use server";
import { getEvents } from "@/app/libs/db/events";
import AdminEventsPageClient from "@/components/AdminEventsPageClient";
import { deleteEventById } from "@/app/admin/events/actions";

export default async function AdminEventsPage() {
  const events = await getEvents(); // safe server-side DB call
  return (
    <AdminEventsPageClient
      initialEvents={events}
      deleteEvent={deleteEventById}
    />
  );
}
