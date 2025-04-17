import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export default function Layout() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  /* --- check cookie once on mount ------------------------------- */
  useEffect(() => {
    fetch(import.meta.env.VITE_API + "/complaints", {
      method: "HEAD",           // cheap request
      credentials: "include",   // send cookie
    }).then((res) => setIsAdmin(res.ok));
  }, []);

  /* --- logout helper -------------------------------------------- */
  const logout = async () => {
    await fetch(import.meta.env.VITE_API + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAdmin(false);
    nav("/login");
  };

  const tabs = [
    { to: "/submit", label: "Submit" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen w-screen bg-brand-50 text-gray-900 flex flex-col">
      {/* ---------------- header ---------------- */}
      <header className="w-full bg-white shadow-sm">
        <nav className="w-full max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
          <span className="font-semibold text-brand-600">Complaint Agent</span>

          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={clsx(
                "px-2 py-1 rounded-md text-sm",
                pathname.startsWith(t.to)
                  ? "bg-brand-100 text-brand-600"
                  : "text-gray-600 hover:text-brand-600"
              )}
            >
              {t.label}
            </Link>
          ))}

          {/* ----------- login / logout button, right‑aligned -------- */}
          <div className="ml-auto">
            {isAdmin ? (
              <button
                onClick={logout}
                className="text-sm px-3 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-500"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm px-3 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-500"
              >
                Admin Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow w-full flex justify-center items-start py-12">
        <Outlet />
      </main>

      <footer className="text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Complaint Agent Demo
      </footer>
    </div>
  );
}