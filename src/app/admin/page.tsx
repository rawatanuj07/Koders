"use server";
import { getEvents } from "@/app/libs/db/events";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminDashboard() {
  const events = await getEvents(); // safe server-side DB call
  return <AdminDashboardClient events={events} />;
}
