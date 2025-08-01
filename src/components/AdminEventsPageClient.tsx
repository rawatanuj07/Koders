"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/Modal";
import type { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";

// Mock events data
// const mockEvents: Event[] = [
//   {
//     id: "1",
//     title: "Tech Innovation Summit 2024",
//     description:
//       "Join industry leaders discussing the future of technology and innovation.",
//     category: "Tech",
//     capacity: 500,
//     bookedSeats: 342,
//     date: "2024-03-15",
//     time: "09:00",
//     mode: "in-person",
//     location: "San Francisco Convention Center",
//     status: "upcoming",
//   },
//   {
//     id: "2",
//     title: "Digital Marketing Masterclass",
//     description: "Learn advanced digital marketing strategies from experts.",
//     category: "Business",
//     capacity: 100,
//     bookedSeats: 87,
//     date: "2024-03-20",
//     time: "14:00",
//     mode: "online",
//     location: "Virtual Event",
//     status: "upcoming",
//   },
//   {
//     id: "3",
//     title: "Jazz Night Live",
//     description: "An evening of smooth jazz with renowned artists.",
//     category: "Music",
//     capacity: 200,
//     bookedSeats: 200,
//     date: "2024-02-25",
//     time: "19:30",
//     mode: "in-person",
//     location: "Blue Note Jazz Club",
//     status: "completed",
//   },
// ];
interface AdminEventsPageClientProps {
  initialEvents: Event[];
}
export default function AdminEventsPageClient({
  initialEvents,
  deleteEvent,
}: {
  initialEvents: Event[];
  deleteEvent: (id: string) => Promise<void>;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filteredEvents = events.filter(
    (event) => statusFilter === "all" || event.status === statusFilter
  );

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = (eventToDelete: Event) => {
    startTransition(async () => {
      await deleteEvent(eventToDelete.id);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    });
  };
  function getStatusColor(
    status: string
  ): "default" | "secondary" | "outline" | "destructive" {
    if (status === "upcoming") return "secondary";
    if (status === "pending") return "outline";
    if (status === "cancelled") return "destructive";
    return "default";
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
          <p className="text-gray-600">Create, edit, and manage your events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </motion.div>

      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        {["all", "upcoming", "ongoing", "completed"].map((status) => (
          <Badge
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            className="cursor-pointer hover:scale-105 transition-transform capitalize"
            onClick={() => setStatusFilter(status)}
          >
            {status === "all" ? "All Events" : status}
          </Badge>
        ))}
      </motion.div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <Badge
                        variant={getStatusColor(event.status)}
                        className="capitalize"
                      >
                        {event.status}
                      </Badge>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>

                    <p className="text-gray-600 mb-3">{event.description}</p>

                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(new Date(event.date))}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {event.time}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        {event.location}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span>{" "}
                        {event.bookedSeats}/{event.capacity}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No events found for the selected filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Event"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <p className="text-black">
              Are you sure you want to delete{" "}
              <strong>{selectedEvent.title}</strong>?
            </p>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. All
                bookings for this event will be cancelled.
              </p>
            </div>

            <div className="flex border border-black gap-3">
              <Button
                variant="destructive"
                onClick={() => confirmDeleteEvent(selectedEvent)}
                className="flex-1 text-black"
              >
                Yes, Delete Event
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
