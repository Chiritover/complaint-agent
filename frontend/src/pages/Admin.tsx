import { useEffect, useState } from "react";
import { Check, Loader2, Trash2, XCircle } from "lucide-react";

type Complaint = {
  id: number;
  name: string;
  email: string;
  complaint: string;
  status: "Pending" | "Resolved";
  created_at: string;
};

export default function Admin() {
  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Pending" | "Resolved">("All");
  const [busy, setBusy] = useState(false);

  /* --- helpers --------------------------------------------------------- */
  const fetchAll = async () => {
    setLoading(true);
    const res = await fetch(import.meta.env.VITE_API + "/complaints", {
      credentials: "include",
    });
    setData(await res.json());
    setLoading(false);
  };

  const toggle = async (c: Complaint) => {
    setBusy(true);
    await fetch(import.meta.env.VITE_API + `/complaints/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        status: c.status === "Pending" ? "Resolved" : "Pending",
      }),
    });
    fetchAll().finally(() => setBusy(false));
  };

  const remove = async (c: Complaint) => {
    if (!confirm(`Delete complaint from ${c.name}?`)) return;
    setBusy(true);
    await fetch(import.meta.env.VITE_API + `/complaints/${c.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchAll().finally(() => setBusy(false));
  };

  /* --- lifecycle ------------------------------------------------------- */
  useEffect(() => {
    fetchAll();
  }, []);

  const filtered =
    filter === "All" ? data : data.filter((c) => c.status === filter);

  /* --- render ---------------------------------------------------------- */
  return (
    <section className="w-full mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-brand-900">
        Admin Dashboard
      </h1>

      {/* filter control */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm">Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="w-36  /* ← or w-40 if you prefer */
           rounded-md border border-brand-600/60
           px-3 py-2 text-brand-900 focus:outline-none
           focus:ring-2 focus:ring-brand-500"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-600 text-white">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Message",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t odd:bg-gray-50">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3 max-w-xs break-words">
                    {c.complaint}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {c.status === "Resolved" ? (
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <Check className="w-4 h-4" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-700">
                        <XCircle className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-4 whitespace-nowrap">
                    <button
                      onClick={() => toggle(c)}
                      className="text-brand-600 hover:underline"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => remove(c)}
                      className="text-red-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500 font-medium"
                  >
                    No complaints in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {busy && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-md shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating…
        </div>
      )}
    </section>
  );
}