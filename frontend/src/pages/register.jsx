import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "https://tamil12354.pythonanywhere.com/api/register/",
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

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      alert("Backend connection failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid md:grid-cols-2">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create Account
          </h2>

          <p className="text-slate-500 text-sm mb-8">
            Join EduPulse AI and start analyzing student performance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase">
                Full Name
              </label>

              <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <User size={18} className="text-slate-400" />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
                />
              </div>
            </div>

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
                  placeholder="Create Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Password example: Test@1234
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition duration-300"
            >
              Register
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-slate-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden md:flex bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-950 p-10 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white/15 rounded-2xl">
                <BrainCircuit size={28} />
              </div>

              <div>
                <h1 className="font-bold text-xl">EduPulse AI</h1>
                <p className="text-xs text-indigo-200 uppercase tracking-widest">
                  Student Success Platform
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">
              Build better learning outcomes with data.
            </h2>

            <p className="text-indigo-100 text-sm leading-relaxed">
              Upload student CSV files, view academic trends, detect risk
              students, and generate AI-powered educational insights.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-indigo-200 mb-2">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase">
                Premium Dashboard
              </span>
            </div>

            <p className="text-sm text-indigo-100">
              Advanced student analytics, attendance tracking, performance
              monitoring, and AI recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}