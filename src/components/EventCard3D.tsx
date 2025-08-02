"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface EventCard3DProps {
  event: Event;
  onBook?: (eventId: string) => void;
  showBookButton?: boolean;
}

export function EventCard3D({
  event,
  onBook,
  showBookButton = true,
}: EventCard3DProps) {
  const availableSeats = event.capacity - event.bookedSeats;
  const isFullyBooked = availableSeats <= 0;

  function getStatusColor(
    status: string
  ): "default" | "secondary" | "outline" | "destructive" {
    if (status === "upcoming") return "secondary";
    if (status === "pending") return "outline";
    if (status === "cancelled") return "destructive";
    return "default";
  }
  return (
    <motion.div
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <Card className="overflow-hidden group  transform-gpu">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 left-4">
            <Badge
              variant={getStatusColor(event.status)}
              className="capitalize"
            >
              {event.status}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge
              variant="outline"
              className=" backdrop-blur-md text-xl bg-black/70"
            >
              {event.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 ">
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2 text-white">
            {event.description}
          </p>

          <div className="space-y-2 mb-4 ">
            <div className="flex items-center text-sm text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(new Date(event.date))} at {event.time}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              {event.mode === "online" ? "Online Event" : event.location}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              {availableSeats} {"out of"} {event.capacity} seats available
            </div>
          </div>

          {showBookButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-colors"
                disabled={isFullyBooked || event.status === "completed"}
                onClick={() => onBook?.(event.id)}
              >
                {isFullyBooked
                  ? "Fully Booked"
                  : event.status === "completed"
                  ? "Event Ended"
                  : "Book Now"}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
