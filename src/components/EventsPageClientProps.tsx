"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { EventCard3D } from "@/components/EventCard3D";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";
import { useUserStore } from "@/store/userStore";

export interface EventsPageClientProps {
  initialEvents: Event[];
}

export default function EventsPageClient({
  initialEvents,
}: EventsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);

  // Date range filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // User from store
  const user = useUserStore((state) => state.user);

  // Filter events based on all filters, including date range
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;

      const matchesMode =
        selectedMode === "All" ||
        (selectedMode === "Online" && event.mode === "online") ||
        (selectedMode === "In-person" && event.mode === "in-person");

      // Parse event date string (assumed ISO string)
      const eventDate = new Date(event.date);

      // Parse filter dates
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesStartDate = start ? eventDate >= start : true;
      const matchesEndDate = end ? eventDate <= end : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    initialEvents,
    searchQuery,
    selectedCategory,
    selectedMode,
    startDate,
    endDate,
  ]);

  // Handle booking modal open
  const handleBookEvent = (eventId: string) => {
    const event = initialEvents.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsBookingModalOpen(true);
    }
  };

  // Confirm booking API call
  const handleConfirmBooking = async () => {
    if (!selectedEvent || !user) {
      alert("Event or user not found.");
      return;
    }

    try {
      const response = await fetch("/api/bookEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          userId: user.id,
          seatsBooked: seatsToBook,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Booking failed");

      alert("Booking confirmed!");

      setIsBookingModalOpen(false);
      setSelectedEvent(null);
      // Refetch events or update UI as needed
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-gray-300 mb-8">
            Find and book amazing events near you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <FilterBar
                selectedCategory={selectedCategory}
                selectedMode={selectedMode}
                startDate={startDate}
                endDate={endDate}
                onSearch={setSearchQuery}
                onCategoryFilter={setSelectedCategory}
                onModeFilter={setSelectedMode}
                onStartDateFilter={setStartDate}
                onEndDateFilter={setEndDate}
              />
            </div>
          </motion.div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-gray-600">
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <EventCard3D event={event} onBook={handleBookEvent} />
                </motion.div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  No events found matching your criteria.
                </p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or search terms.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Confirm Booking"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg align-center">
                {selectedEvent.title}
              </h3>
              <p className="text-gray-400">{selectedEvent.description}</p>
            </div>

            <div className="bg-gray-500 p-4 rounded-lg space-y-2">
              <p>
                <span className="font-medium">Date:</span> {selectedEvent.date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {selectedEvent.time}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {selectedEvent.location}
              </p>
              <p>
                <span className="font-medium">Available Seats:</span>{" "}
                {selectedEvent.capacity - selectedEvent.bookedSeats}
              </p>
              <p className="text-red-700 bg-black rounded-lg p-2 text-center">
                max number seats that can be booked is 2.
              </p>
              <input
                type="number"
                min={1}
                max={2}
                value={seatsToBook}
                onChange={(e) => {
                  let value = parseInt(e.target.value, 10);
                  if (isNaN(value)) value = 1;
                  if (value < 1) value = 1;
                  if (value > 2) value = 2;
                  setSeatsToBook(value);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleConfirmBooking}
                className="flex-1 bg-gradient-to-r from-green-800 to-green-500 transition-colors"
              >
                Confirm Booking
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1"
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
