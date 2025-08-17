"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      logout();
      router.push("/");
      router.refresh();
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 w-full bg-gradient-to-r from-gray-1000 via-purple-900 to-red-800 backdrop-blur-sm shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventEase
            </span>
          </Link>

          {/* Always Visible (Events + Login/Register) */}
          <div className="flex items-center space-x-3">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="hover:cursor-pointer border rounded">
                Events
              </Button>
            </Link>

            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>{user.username}</span>
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Login
                </Button>
              </Link>
            )}

            {/* Hamburger for mobile */}
            <div className="md:hidden">
              <button onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Menu (full visible on large screens) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            {user && (
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                disabled={loading}
              >
                {loading ? (
                  "Logging out..."
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </>
                )}
              </Button>
            )}
            {!user && (
              <Link href="/register">
                <Button variant="outline">Get Started!</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-gradient-to-r from-gray-1000 via-purple-900 to-red-800 px-4 py-4 space-y-4 shadow-lg">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full text-left">
              Home
            </Button>
          </Link>
          {user && (
            <Link
              href={user.role === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setMobileOpen(false)}
            >
              <Button variant="ghost" size="sm" className="w-full text-left">
                Dashboard
              </Button>
            </Link>
          )}
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-left"
              onClick={onLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          ) : (
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full text-left">
                Get Started!
              </Button>
            </Link>
          )}
        </div>
      )}
    </motion.nav>
  );
}
