"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { FilterBar } from "@/components/FilterBar"
import { EventCard3D } from "@/components/EventCard3D"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"

// Mock events data
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    description:
      "Join industry leaders discussing the future of technology and innovation. Network with professionals and discover cutting-edge solutions.",
    category: "Tech",
    capacity: 500,
    bookedSeats: 342,
    date: "2024-03-15",
    time: "09:00",
    mode: "in-person",
    location: "San Francisco Convention Center",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    description: "Learn advanced digital marketing strategies from experts in the field.",
    category: "Business",
    capacity: 100,
    bookedSeats: 87,
    date: "2024-03-20",
    time: "14:00",
    mode: "online",
    location: "Virtual Event",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Jazz Night Live",
    description: "An evening of smooth jazz with renowned artists from around the world.",
    category: "Music",
    capacity: 200,
    bookedSeats: 156,
    date: "2024-03-25",
    time: "19:30",
    mode: "in-person",
    location: "Blue Note Jazz Club",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to top investors.",
    category: "Business",
    capacity: 300,
    bookedSeats: 245,
    date: "2024-03-30",
    time: "18:00",
    mode: "in-person",
    location: "Innovation Hub",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Art Gallery Opening",
    description: "Exclusive opening of contemporary art exhibition featuring local artists.",
    category: "Art",
    capacity: 150,
    bookedSeats: 89,
    date: "2024-04-05",
    time: "17:00",
    mode: "in-person",
    location: "Modern Art Gallery",
    status: "upcoming",
  },
  {
    id: "6",
    title: "Food & Wine Festival",
    description: "Taste exquisite dishes and wines from award-winning chefs and sommeliers.",
    category: "Food",
    capacity: 400,
    bookedSeats: 312,
    date: "2024-04-10",
    time: "12:00",
    mode: "in-person",
    location: "Central Park Pavilion",
    status: "upcoming",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedMode, setSelectedMode] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
      const matchesMode =
        selectedMode === "All" ||
        (selectedMode === "Online" && event.mode === "online") ||
        (selectedMode === "In-person" && event.mode === "in-person")

      return matchesSearch && matchesCategory && matchesMode
    })
  }, [searchQuery, selectedCategory, selectedMode])

  const handleBookEvent = (eventId: string) => {
    const event = mockEvents.find((e) => e.id === eventId)
    if (event) {
      setSelectedEvent(event)
      setIsBookingModalOpen(true)
    }
  }

  const handleConfirmBooking = () => {
    // Here you would typically make an API call to book the event
    console.log("Booking confirmed for event:", selectedEvent?.id)
    setIsBookingModalOpen(false)
    setSelectedEvent(null)
    // Show success message
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-2">Discover Events</h1>
          <p className="text-gray-600 mb-8">Find and book amazing events near you</p>
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
                onSearch={setSearchQuery}
                onCategoryFilter={setSelectedCategory}
                onModeFilter={setSelectedMode}
                selectedCategory={selectedCategory}
                selectedMode={selectedMode}
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
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Confirm Booking">
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
              <p className="text-gray-600">{selectedEvent.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p>
                <span className="font-medium">Date:</span> {selectedEvent.date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {selectedEvent.time}
              </p>
              <p>
                <span className="font-medium">Location:</span> {selectedEvent.location}
              </p>
              <p>
                <span className="font-medium">Available Seats:</span>{" "}
                {selectedEvent.capacity - selectedEvent.bookedSeats}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConfirmBooking} className="flex-1">
                Confirm Booking
              </Button>
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
