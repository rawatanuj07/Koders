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
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    typeof (payload as any).id === "string" &&
    "username" in payload &&
    typeof (payload as any).username === "string" &&
    "email" in payload &&
    typeof (payload as any).email === "string" &&
    "role" in payload &&
    typeof (payload as any).role === "string"
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
