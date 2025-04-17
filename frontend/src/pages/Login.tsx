import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(import.meta.env.VITE_API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) nav("/admin");
    else setErr("Incorrect password");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-brand-50 px-4">
      <form
        onSubmit={login}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-6 text-brand-900">
          Admin Login
        </h2>

        {/* password field */}
        <input
          type="password"
          className="w-full border rounded-md p-2 mb-4"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}

        {/* login button */}
        <button className="w-full bg-brand-600 text-white py-2 rounded-md">
          Log in
        </button>

        {/* NEW — back link */}
        <div className="text-center mt-4">
          <Link
            to="/submit"
            className="text-sm text-brand-600 hover:underline"
          >
            ← Back to Complaint Form
          </Link>
        </div>
      </form>
    </div>
  );
}