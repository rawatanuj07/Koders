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
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
          <p className="text-gray-300 underline underline-offset-4">
            Create, edit, and manage your events
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button className="flex items-left border border-sky-500 text-sky-400 text-2xl cursor-pointer hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 " />
            Create Event
          </Button>
        </Link>
      </motion.div> */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex flex-row">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-white">
              Manage Events
            </h1>
            <p className="text-gray-200 underline underline-offset-4 mb-2">
              Create, edit, and manage your events
            </p>
          </div>
          <div className=" align-right justify-right items-right ">
            <p className="text-sky-400  font-semibold italic">
              Ready to make your next event unforgettable? Click below to get
              started!
            </p>
            <Link href="/admin/events/new" passHref>
              <Button
                className="flex mt-4 items-center bg-sky-600 hover:bg-sky-700 text-white text-2xl px-6 py-3 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110"
                type="button"
              >
                <Plus className="w-6 h-6 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-start mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1 text-white">Manage Events</h1>
          <p className="text-gray-200 underline underline-offset-4 mb-2">
            Create, edit, and manage your events
          </p>
        </div>
        <div className="flex flex-row mr-4 items-end max-w-md text-right">
          <p className="text-white mr-4 text-lg font-semibold italic">
            Your perfect event, just a few clicks away!!
          </p>
          <Link href="/admin/events/new" passHref>
            <Button
              className="flex mt-4 items-center  bg-indigo-600 hover:bg-green-700 text-white text-3xl pr-4 py-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110"
              type="button"
            >
              <Plus className="w-16 h-16  " />
              Create Event
            </Button>
          </Link>
        </div>
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
              <CardContent className="p-6 bg-gray-900">
                <div className="flex justify-between  items-start">
                  <div className="flex-1">
                    <div className="flex items-center  gap-3 mb-2  p-4 rounded-lg">
                      <h3 className="text-4xl font-semibold underline  underline-offset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {event.title}
                      </h3>
                      <Badge
                        variant={getStatusColor(event.status)}
                        className={`capitalize text-sm ${
                          event.status === "upcoming"
                            ? "text-green-600 border-green-600"
                            : event.status === "completed"
                            ? "text-red-600 border-red-600"
                            : "text-blue-600 border-red-600"
                        }`}
                      >
                        {event.status}
                      </Badge>
                      <p>Category:</p>
                      <Badge
                        variant="outline"
                        className="border border-yellow-500 text-yellow-400 text-sm"
                      >
                        {event.category}
                      </Badge>
                      <div>
                        <span className="font-medium border border-gray-300 text-gray-200 text-sm rounded-lg px-2 py-1">
                          Seats-Left: {event.capacity - event.bookedSeats}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-200 mb-3">{event.description}</p>

                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-300">
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
                        <span className="font-medium">
                          Capacity: {event.capacity}
                        </span>{" "}
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
                {isPending ? "Deleting..." : "Yes, Delete Event"}
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
