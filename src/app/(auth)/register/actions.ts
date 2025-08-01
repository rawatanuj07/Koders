"use server";
import bcryptjs from "bcryptjs";
import clientPromise from "@/app/lib/mongodb";
import { redirect } from "next/navigation";

export async function addUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const client = await clientPromise;
  console.log("Connected to MongoDB successfully");
  const database = client.db("koders");
  const usersCollection = database.collection("users");

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const result = await usersCollection
    .insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })
    .catch((error) => {
      console.error("Error inserting user:", error);
      throw error;
    });
  if (result.acknowledged) {
    console.log("Success", result.insertedId);
    redirect("/login");
  } else {
    console.error("Failed to insert user");
    throw new Error("Failed to register user");
  }
}
