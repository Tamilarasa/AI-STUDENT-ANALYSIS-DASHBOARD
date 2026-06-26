import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      "https://tamil12354.pythonanywhere.com/api/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      }
    );

    if (!response.ok) {
      alert("Invalid email or password");
      return;
    }

    const data = await response.json();

    localStorage.setItem("user", JSON.stringify(data));
    navigate("/dashboard");
  } catch (error) {
    alert("Backend connection failed");
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid md:grid-cols-2">
        
        <div className="hidden md:flex bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-indigo-600 rounded-2xl">
                <BrainCircuit size={28} />
              </div>

              <div>
                <h1 className="font-bold text-xl">EduPulse AI</h1>
                <p className="text-xs text-indigo-300 uppercase tracking-widest">
                  Analytics Panel
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">
              Welcome back to smart student analytics.
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Login to access student analytics, performance monitoring,
              attendance insights, and AI-powered recommendations.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-indigo-300 mb-2">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase">
                AI Engine Active
              </span>
            </div>

            <p className="text-sm text-slate-300">
              Real-time academic intelligence and predictive analytics enabled.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Sign In
          </h2>

          <p className="text-slate-500 text-sm mb-8">
            Enter your details to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase">
                Email Address
              </label>

              <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Mail size={18} className="text-slate-400" />

                <input
                  type="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase">
                Password
              </label>

              <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Lock size={18} className="text-slate-400" />

                <input
                  type="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" />
                Remember Me
              </label>

              <a
                href="#"
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition duration-300"
            >
              Login
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-slate-600 text-center mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:text-indigo-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}