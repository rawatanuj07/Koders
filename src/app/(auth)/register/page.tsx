"use client";

import Link from "next/link";
import { addUser } from "./actions"; // your server action

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        <form action={addUser} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 border rounded-lg w-full"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-l from-green-900 to-green-400 text-white font-medium rounded-lg p-3 w-full"
          >
            Sign Up
          </button>
        </form>

        <Link
          href="/login"
          className="block text-center mt-6 bg-gradient-to-l from-blue-900 to-blue-400 text-white rounded-lg p-3 w-full"
        >
          Visit Login
        </Link>
      </div>
    </div>
  );
}
