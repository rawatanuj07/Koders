"use server";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/app/libs/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const client = await clientPromise;
  const database = client.db("koders");
  const usersCollection = database.collection("users");

  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw new Error("User does not exist");
  }

  const validPassword = await bcryptjs.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const tokenData = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  (await cookies()).set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  redirect("/");
}
