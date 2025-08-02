"use server";
import { getEvents } from "@/app/libs/db/events";
import EventsPageClient from "./../../components/EventsPageClientProps"; // move your current UI to this file/component
import type { Event } from "@/lib/types";

export default async function EventsPage() {
  const events: Event[] = await getEvents();

  return <EventsPageClient initialEvents={events} />;
}
