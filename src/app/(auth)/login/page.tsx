import { loginUser } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full max-w-xl p-8">
        <h1>Login</h1>
        <hr />
        <form action={loginUser} className="w-full flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            className="p-2 border border-gray-300 mb-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            name="email"
            type="email"
            placeholder="Email"
          />

          <label htmlFor="password">Password</label>
          <input
            className="p-2 border border-gray-300 mb-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
            name="password"
            type="password"
            placeholder="Password"
          />

          <button
            type="submit"
            className="bg-gradient-to-l from-green-900 to-green-400 text-white rounded-lg p-2 my-2 px-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
