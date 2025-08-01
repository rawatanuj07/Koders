import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import HomePageClient from "@/components/HomePageClient";

interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

function isUserPayload(payload: unknown): payload is UserPayload {
  if (typeof payload !== "object" || payload === null) return false;

  // Narrow to generic object with string keys
  const obj = payload as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.username === "string" &&
    typeof obj.email === "string" &&
    typeof obj.role === "string"
  );
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: UserPayload | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.TOKEN_SECRET!)
      );

      if (isUserPayload(payload)) {
        user = payload;
      } else {
        user = null;
      }
    } catch {
      user = null;
    }
  }

  return <HomePageClient user={user} />;
}
