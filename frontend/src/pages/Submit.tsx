import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function Submit() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    complaint: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // needs “@” and at least one “.” after it
  const isEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic required‑field check
    if (!form.name.trim() || !form.email.trim() || !form.complaint.trim()) {
      setError("All fields are required.");
      return;
    }

    // your stricter email rule
    if (!isEmail(form.email)) {
      setError("Please enter a valid e-mail address.");
      return;
    }

    const res = await fetch(
      import.meta.env.VITE_API + "/complaints",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      setSent(true);
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.message || "Please enter a valid e-mail address.");
    }
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto mt-24 text-center space-y-4">
        <CheckCircle className="w-16 h-16 mx-auto text-brand-600" />
        <h2 className="text-2xl font-semibold">Thanks for your feedback!</h2>
        <p className="text-gray-600">
          We’ve received your complaint and will look into it shortly.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-10">
      <h2 className="text-2xl font-semibold mb-6 text-brand-900">
        Submit a Complaint
      </h2>

      {/* noValidate lets your JS always run */}
      <form noValidate onSubmit={onSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 focus:ring-brand-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 focus:ring-brand-500"
          />
        </div>

        {/* Complaint */}
        <div>
          <label className="block text-sm font-medium mb-1">Complaint</label>
          <textarea
            name="complaint"
            rows={4}
            value={form.complaint}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 focus:ring-brand-500"
          />
        </div>

        {/* Inline error (matches your other errors) */}
        {error && (
          <p className="text-red-600 text-sm -mt-2">{error}</p>
        )}

        <button
          className="w-full py-2 rounded-md bg-brand-600 text-white font-medium hover:bg-brand-500 transition"
        >
          Submit
        </button>
      </form>
    </section>
  );
}