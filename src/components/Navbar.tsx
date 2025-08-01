"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  console.log("User in Navbar:", user);
  const onLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      logout(); // clear Zustand user state
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
      className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#0f172a] backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventEase
            </span>
          </Link>

          <div className="flex space-x-4 overflow-x-auto whitespace-nowrap mx-4 scrollbar-hide">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="ghost" size="sm">
                Events
              </Button>
            </Link>
            {user && (
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-white-600">Welcome</span>
                {/* <Link href={user.role === "admin" ? "/admin" : "/dashboard"}> */}
                <Link href="/">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    size="sm"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.username}
                  </Button>
                </Link>
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
                      <LogOut className="w-4 h-4 mr-2 cursor-pointer" />
                      Logout
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="cursor-pointer">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Get Started!</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
