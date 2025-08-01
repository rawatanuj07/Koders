"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Download, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

// Mock attendees data
const mockAttendees = [
  {
    id: "1",
    eventId: "1",
    eventTitle: "Tech Innovation Summit 2024",
    userName: "John Doe",
    userEmail: "john@example.com",
    seatsBooked: 2,
    bookingTime: "2024-02-15T10:30:00Z",
    status: "confirmed",
  },
  {
    id: "2",
    eventId: "1",
    eventTitle: "Tech Innovation Summit 2024",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    seatsBooked: 1,
    bookingTime: "2024-02-16T14:20:00Z",
    status: "confirmed",
  },
  {
    id: "3",
    eventId: "2",
    eventTitle: "Digital Marketing Masterclass",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    seatsBooked: 1,
    bookingTime: "2024-02-18T09:15:00Z",
    status: "confirmed",
  },
];

const mockEvents = [
  { id: "1", title: "Tech Innovation Summit 2024" },
  { id: "2", title: "Digital Marketing Masterclass" },
  { id: "3", title: "Jazz Night Live" },
];

export default function AttendeesPage() {
  const [selectedEventId, setSelectedEventId] = useState("all");

  const filteredAttendees =
    selectedEventId === "all"
      ? mockAttendees
      : mockAttendees.filter(
          (attendee) => attendee.eventId === selectedEventId
        );

  const totalAttendees = filteredAttendees.length;
  const totalSeats = filteredAttendees.reduce(
    (sum, attendee) => sum + attendee.seatsBooked,
    0
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Event Attendees</h1>
        <p className="text-gray-600">Manage and view event registrations</p>
      </motion.div>

      {/* Event Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Event
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Events</option>
          {mockEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                    Total Attendees
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalAttendees}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
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
                  <p className="text-3xl font-bold text-green-600">
                    {totalSeats}
                  </p>
                </div>
                <Badge className="text-lg px-3 py-1">{totalSeats}</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Attendees Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Registered Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Event
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Seats
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Booking Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.map((attendee, index) => (
                    <motion.tr
                      key={attendee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{attendee.userName}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {attendee.userEmail}
                      </td>
                      <td className="py-3 px-4">{attendee.eventTitle}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{attendee.seatsBooked}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(new Date(attendee.bookingTime))}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="default"
                          className="capitalize text-green-600"
                        >
                          {attendee.status}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredAttendees.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No attendees found</p>
                  <p className="text-gray-400 mt-2">
                    Attendees will appear here once they register for events.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
