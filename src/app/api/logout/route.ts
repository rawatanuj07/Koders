export async function POST() {
  return new Response(null, {
    status: 200,
    headers: {
      // Clear cookie by setting it expired
      "Set-Cookie": `token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    },
  });
}
