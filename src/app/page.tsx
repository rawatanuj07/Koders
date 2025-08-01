import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import HomePageClient from "@/components/HomePageClient";

interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

function isUserPayload(payload: any): payload is UserPayload {
  return (
    payload &&
    typeof payload.id === "string" &&
    typeof payload.username === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
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
