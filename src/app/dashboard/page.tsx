"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useUserStore } from "@/store/userStore";
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
  eventDate: string; // ISO date string
  eventTime: string;
  eventLocation: string;
  seatsBooked: number;
  bookingTime: string; // ISO date string
  status: BookingStatus;
};

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings for logged in user
  useEffect(() => {
    async function fetchBookings() {
      if (!user) {
        setBookings([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/guestBooking?userId=${user.id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        const data = await response.json();

        setBookings(data.bookings);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  // Cancel booking modal handlers
  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsCancelModalOpen(true);
    }
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      console.log("Cancelling booking:", selectedBooking.id);
      const response = await fetch(`/api/guestCancel/${selectedBooking.id}`, {
        method: "POST",
      });

      const data = await response.json();
      console.log("Cancel booking response:", data); // Debugging log
      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      // Update UI state locally to reflect the cancelled status
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
      setSelectedBooking(null);
      setIsCancelModalOpen(false);
    } catch (err: unknown) {
      console.log("Error cancelling booking:", err);
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  // Stats calculations
  const totalBookings = bookings.length;
  // Active (confirmed) bookings count
  const activeBookingsCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  // Cancelled bookings count
  const cancelledBookingsCount = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;
  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.eventDate) > new Date()
  );
  const totalSeatsBooked = bookings.reduce(
    (sum, booking) => sum + booking.seatsBooked,
    0
  );
  // Active seats
  const activeSeats = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.seatsBooked, 0);

  // Cancelled seats
  const cancelledSeats = bookings
    .filter((b) => b.status === "cancelled")
    .reduce((sum, b) => sum + b.seatsBooked, 0);
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
          <p className="text-gray-200 mb-8">
            Manage your event bookings and preferences
          </p>
          {loading && (
            <p className="text-sm text-gray-500">Loading bookings...</p>
          )}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
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
                    <p className="text-sm font-medium text-gray-200">
                      Total Bookings
                    </p>
                    <motion.p
                      className="text-3xl font-bold text-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      {totalBookings}
                    </motion.p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <div className="text-green-600">
                        Active: {activeBookingsCount}
                      </div>
                      <div className="text-red-600">
                        Cancelled: {cancelledBookingsCount}
                      </div>
                    </div>
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
                <div className="flex items-center h-full justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-200">
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
                    <p className="text-sm font-medium text-gray-200">
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
                    <div className="flex gap-4 mt-2 text-sm">
                      <div className="text-green-600">
                        Active: {activeSeats}
                      </div>
                      <div className="text-red-600">
                        Cancelled: {cancelledSeats}
                      </div>
                    </div>
                  </div>

                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* My Bookings List */}
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
                        <div className="space-y-1 text-sm text-gray-200">
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

                {bookings.length === 0 && !loading && (
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
            <p className="text-gray-200">
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
