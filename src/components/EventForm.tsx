"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types";
import Link from "next/link";

interface EventFormProps {
  event?: Event;
  action?: (formData: FormData) => Promise<void>; // Server action for form submission
  isEditing?: boolean;
}

const categories = ["Tech", "Business", "Music", "Sports", "Art", "Food"];
const statuses = ["upcoming", "ongoing", "completed", "cancelled"];

export function EventForm({
  event,
  action,
  isEditing = false,
}: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    category: event?.category || "Tech",
    capacity: event?.capacity || 100,
    date: event?.date || "",
    time: event?.time || "",
    mode: event?.mode || "in-person",
    location: event?.location || "",
    status: event?.status || "upcoming",
  });

  // Sync state if event prop changes (e.g., navigation between edits)
  useEffect(() => {
    setFormData({
      title: event?.title || "",
      description: event?.description || "",
      category: event?.category || "Tech",
      capacity: event?.capacity || 100,
      date: event?.date || "",
      time: event?.time || "",
      mode: event?.mode || "in-person",
      location: event?.location || "",
      status: event?.status || "upcoming",
    });
  }, [event]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Event" : "Create New Event"}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Use native form submission to server action */}
          <form action={action} className="space-y-6">
            {/* If editing, include hidden id input */}
            {isEditing && <input type="hidden" name="id" value={event?.id} />}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter event description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Capacity
                </label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleChange("capacity", Number(e.target.value))
                  }
                  placeholder="Event capacity"
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time
                </label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="in-person"
                    checked={formData.mode === "in-person"}
                    onChange={(e) => handleChange("mode", e.target.value)}
                    className="mr-2"
                  />
                  In-person
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="online"
                    checked={formData.mode === "online"}
                    onChange={(e) => handleChange("mode", e.target.value)}
                    className="mr-2"
                  />
                  Online
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder={
                  formData.mode === "online"
                    ? "Virtual Event Platform"
                    : "Event venue address"
                }
                required
              />
            </div>

            {/* Show status select if editing */}
            {isEditing && (
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map((statusOpt) => (
                    <option key={statusOpt} value={statusOpt}>
                      {statusOpt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {isEditing ? "Update Event" : "Create Event"}
              </Button>
              {/* Cancel button as Link */}
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin/events" className="w-full block text-center">
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
