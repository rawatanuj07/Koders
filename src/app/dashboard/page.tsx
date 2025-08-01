"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/BookingStatusBadge";
import { Modal } from "@/components/Modal";
import { formatDate } from "@/lib/utils";
type BookingStatus = "confirmed" | "cancelled";

type Booking = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  seatsBooked: number;
  bookingTime: string;
  status: BookingStatus;
};

// Mock user bookings data
const mockBookings: Booking[] = [
  {
    id: "1",
    eventId: "1",
    eventTitle: "Tech Innovation Summit 2024",
    eventDate: "2024-03-15",
    eventTime: "09:00",
    eventLocation: "San Francisco Convention Center",
    seatsBooked: 2,
    bookingTime: "2024-02-15T10:30:00Z",
    status: "confirmed" as const,
  },
  {
    id: "2",
    eventId: "2",
    eventTitle: "Digital Marketing Masterclass",
    eventDate: "2024-03-20",
    eventTime: "14:00",
    eventLocation: "Virtual Event",
    seatsBooked: 1,
    bookingTime: "2024-02-18T15:45:00Z",
    status: "confirmed" as const,
  },
  {
    id: "3",
    eventId: "3",
    eventTitle: "Jazz Night Live",
    eventDate: "2024-03-25",
    eventTime: "19:30",
    eventLocation: "Blue Note Jazz Club",
    seatsBooked: 2,
    bookingTime: "2024-02-20T09:15:00Z",
    status: "confirmed" as const,
  },
];

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<
    (typeof mockBookings)[0] | null
  >(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsCancelModalOpen(true);
    }
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "cancelled" as const }
            : booking
        )
      );
      setIsCancelModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === "confirmed");
  const totalSeatsBooked = bookings.reduce(
    (sum, booking) => sum + booking.seatsBooked,
    0
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Manage your event bookings and preferences
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Bookings
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      {bookings.length}
                    </motion.p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Upcoming Events
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-green-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 }}
                    >
                      {upcomingBookings.length}
                    </motion.p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Seats
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-purple-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.7 }}
                    >
                      {totalSeatsBooked}
                    </motion.p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {booking.eventTitle}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(new Date(booking.eventDate))} at{" "}
                            {booking.eventTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {booking.eventLocation}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {booking.seatsBooked} seat
                            {booking.seatsBooked > 1 ? "s" : ""} booked
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookingStatusBadge status={booking.status} />
                        {booking.status === "confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Booked on {formatDate(new Date(booking.bookingTime))}
                    </div>
                  </motion.div>
                ))}

                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No bookings yet</p>
                    <p className="text-gray-400 mt-2">
                      Start exploring events to make your first booking!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to cancel your booking for{" "}
              <strong>{selectedBooking.eventTitle}</strong>?
            </p>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> This action cannot be undone. You will
                lose your reserved seats.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={confirmCancelBooking}
                className="flex-1"
              >
                Yes, Cancel Booking
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1"
              >
                Keep Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
