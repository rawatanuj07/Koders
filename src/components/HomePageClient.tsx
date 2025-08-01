"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Calendar, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventCard3D } from "@/components/EventCard3D";
import { Navbar } from "@/components/Navbar";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

// Mock data for preview
const mockEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    description:
      "Join industry leaders discussing the future of technology and innovation.",
    category: "Tech",
    capacity: 500,
    bookedSeats: 342,
    date: "2024-03-15",
    time: "09:00",
    mode: "in-person" as const,
    location: "San Francisco Convention Center",
    status: "upcoming" as const,
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    description: "Learn advanced digital marketing strategies from experts.",
    category: "Business",
    capacity: 100,
    bookedSeats: 87,
    date: "2024-03-20",
    time: "14:00",
    mode: "online" as const,
    location: "Virtual Event",
    status: "upcoming" as const,
  },
  {
    id: "3",
    title: "Jazz Night Live",
    description: "An evening of smooth jazz with renowned artists.",
    category: "Music",
    capacity: 200,
    bookedSeats: 156,
    date: "2024-03-25",
    time: "19:30",
    mode: "in-person" as const,
    location: "Blue Note Jazz Club",
    status: "upcoming" as const,
  },
];

const categories = ["Music", "Tech", "Business", "Sports", "Art", "Food"];
interface HomePageClientProps {
  user: { id: string; username: string; email: string; role: string } | null;
}
export default function HomePageClient({ user }: HomePageClientProps) {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  const onLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      logout(); // clear Zustand user state
      router.push("/"); // redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  useEffect(() => {
    if (user) setUser(user);
    else setUser(null);
  }, [user, setUser]);
  return (
    <div className="min-h-screen">
      <Navbar onLogout={onLogout} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto h-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Amazing Events
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              EventEase
            </h1>

            <p
              className="text-xl my-8 mt-4 md:text-4xl bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-600 bg-clip-text text-transparent
              mb-8 max-w-3xl mx-auto"
            >
              Your gateway to extraordinary experiences. Book events, connect
              with communities, and create unforgettable memories.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg" className="group">
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose EventEase?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of event booking with our cutting-edge
              platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Booking",
                description:
                  "Intelligent event discovery and seamless booking experience",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Connect with like-minded people and build lasting relationships",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Book events in seconds with our optimized platform",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-8 h-full">
                  <CardContent>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600">
              Find events that match your interests
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  variant="outline"
                  className="px-6 py-3 text-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {category}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600">
              Don`&apos;`t miss these amazing upcoming events
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <EventCard3D event={event} showBookButton={false} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/events">
              <Button size="lg" variant="outline">
                View All Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of event enthusiasts and start your journey today
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Create Your Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
