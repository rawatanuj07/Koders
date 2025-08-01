export interface Event {
  id: string
  title: string
  description: string
  category: string
  capacity: number
  bookedSeats: number
  date: string
  time: string
  mode: "online" | "in-person"
  location: string
  status: "upcoming" | "ongoing" | "completed"
  image?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface Booking {
  id: string
  userId: string
  eventId: string
  userName: string
  userEmail: string
  seatsBooked: number
  bookingTime: string
  status: "confirmed" | "cancelled"
}
