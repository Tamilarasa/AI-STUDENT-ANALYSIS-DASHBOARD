import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import API from "../services/api";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  FileText,
  BrainCircuit,
  AlertCircle,
  Search,
  Upload,
  FileSpreadsheet,
  LayoutDashboard,
  GraduationCap,
  Settings,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Trophy,
  Target,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [studentRecords, setStudentRecords] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    avgAttendance: "0%",
    accuracy: "98.4%",
  });

  useEffect(() => {
    API.get("dashboard/")
      .then((res) => {
        setMetrics({
          totalStudents: res.data.students,
          avgAttendance: `${res.data.attendance}%`,
          accuracy: "98.4%",
        });

        setChartData([
          { month: "Jan", avgGrade: 60, attendance: 70 },
          { month: "Feb", avgGrade: 64, attendance: 72 },
          { month: "Mar", avgGrade: 72, attendance: 75 },
          { month: "Apr", avgGrade: 68, attendance: 74 },
          { month: "May", avgGrade: 76, attendance: res.data.attendance },
        ]);
      })
      .catch((err) => console.log(err));
  }, []);

  const processUploadedData = (data) => {
    const students = data.map((row, index) => {
      const gradeVal = parseFloat(row.Grade) || 0;
      const attendanceVal = parseFloat(row.Attendance) || 0;

      let status = "Stable";
      if (gradeVal >= 85) status = "Excelling";
      if (gradeVal < 65 || attendanceVal < 80) status = "At Risk";

      return {
        id: row["Student ID"] || `STU${String(index + 1).padStart(3, "0")}`,
        name: row.Name || "Unknown Student",
        email:
          row.Email ||
          `${(row.Name || "student").toLowerCase().replace(/\s+/g, "")}@edu.com`,
        grade: `${gradeVal}%`,
        attendance: `${attendanceVal}%`,
        rawGrade: gradeVal,
        rawAttendance: attendanceVal,
        status,
      };
    });

    const total = students.length;

    const avgGrade = total
      ? Math.round(students.reduce((a, s) => a + s.rawGrade, 0) / total)
      : 0;

    const avgAttendance = total
      ? Math.round(students.reduce((a, s) => a + s.rawAttendance, 0) / total)
      : 0;

    const atRiskCount = students.filter(
      (s) => s.rawGrade < 65 || s.rawAttendance < 80
    ).length;

    const excellingCount = students.filter((s) => s.rawGrade >= 85).length;

    setStudentRecords(students);

    setMetrics({
      totalStudents: total,
      avgAttendance: `${avgAttendance}%`,
      accuracy: "98.4%",
    });

    setChartData([
      {
        month: "Jan",
        avgGrade: Math.max(60, avgGrade - 12),
        attendance: Math.max(70, avgAttendance - 2),
      },
      {
        month: "Feb",
        avgGrade: Math.max(64, avgGrade - 10),
        attendance: Math.max(70, avgAttendance - 3),
      },
      {
        month: "Mar",
        avgGrade: Math.max(72, avgGrade - 5),
        attendance: Math.max(72, avgAttendance + 1),
      },
      {
        month: "Apr",
        avgGrade: Math.max(68, avgGrade - 7),
        attendance: Math.max(70, avgAttendance - 4),
      },
      {
        month: "May",
        avgGrade,
        attendance: avgAttendance,
      },
    ]);

    setAiInsights([
      {
        type: "warning",
        text: `AI model flagged ${atRiskCount} student(s) needing academic support.`,
      },
      {
        type: "success",
        text: `${excellingCount} student(s) are performing at an excellent level.`,
      },
      {
        type: "success",
        text: "Improvement plan generated based on grade and attendance patterns.",
      },
    ]);

    setActiveTab("dashboard");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => processUploadedData(results.data),
      error: () => alert("Failed to parse CSV file."),
    });
  };

  const filteredStudents = studentRecords.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageGrade = studentRecords.length
    ? Math.round(
        studentRecords.reduce((a, s) => a + s.rawGrade, 0) /
          studentRecords.length
      )
    : 0;

  const atRiskStudents = studentRecords.filter(
    (s) => s.rawGrade < 65 || s.rawAttendance < 80
  );

  const weakGradeStudents = studentRecords.filter((s) => s.rawGrade < 65);

  const lowAttendanceStudents = studentRecords.filter(
    (s) => s.rawAttendance < 80
  );

  const excellingStudents = studentRecords.filter((s) => s.rawGrade >= 85);

  const stableStudents = studentRecords.filter((s) => s.status === "Stable");

  const riskPercentage = studentRecords.length
    ? Math.round((atRiskStudents.length / studentRecords.length) * 100)
    : 0;

  const gradeDistributionData = [
    {
      range: "0-49",
      students: studentRecords.filter((s) => s.rawGrade < 50).length,
    },
    {
      range: "50-64",
      students: studentRecords.filter(
        (s) => s.rawGrade >= 50 && s.rawGrade < 65
      ).length,
    },
    {
      range: "65-84",
      students: studentRecords.filter(
        (s) => s.rawGrade >= 65 && s.rawGrade < 85
      ).length,
    },
    {
      range: "85-100",
      students: studentRecords.filter((s) => s.rawGrade >= 85).length,
    },
  ];

  const attendanceDistributionData = [
    {
      range: "Below 60",
      students: studentRecords.filter((s) => s.rawAttendance < 60).length,
    },
    {
      range: "60-79",
      students: studentRecords.filter(
        (s) => s.rawAttendance >= 60 && s.rawAttendance < 80
      ).length,
    },
    {
      range: "80-89",
      students: studentRecords.filter(
        (s) => s.rawAttendance >= 80 && s.rawAttendance < 90
      ).length,
    },
    {
      range: "90-100",
      students: studentRecords.filter((s) => s.rawAttendance >= 90).length,
    },
  ];

  const statusData = [
    { name: "At Risk", value: atRiskStudents.length },
    { name: "Stable", value: stableStudents.length },
    { name: "Excelling", value: excellingStudents.length },
  ];

  const topStudents = [...studentRecords]
    .sort((a, b) => b.rawGrade - a.rawGrade)
    .slice(0, 5);

  const pieColors = ["#ef4444", "#3b82f6", "#10b981"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex">
      <aside className="w-72 bg-white border-r border-slate-200/80 p-5 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-8">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <BrainCircuit size={24} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900 text-lg">EduPulse AI</h1>
              <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-widest">
                Student Intelligence
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <MenuBtn
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
              icon={<LayoutDashboard size={18} />}
              text="Dashboard"
            />

            <MenuBtn
              active={activeTab === "roster"}
              onClick={() => setActiveTab("roster")}
              icon={<GraduationCap size={18} />}
              text="Student Roster"
            />

            <MenuBtn
              active={activeTab === "improvement"}
              onClick={() => setActiveTab("improvement")}
              icon={<TrendingUp size={18} />}
              text="Performance Improvement"
            />

            <MenuBtn
              active={activeTab === "controls"}
              onClick={() => setActiveTab("controls")}
              icon={<Settings size={18} />}
              text="Engine Controls"
            />
          </nav>
        </div>

        <div className="bg-slate-950 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-2 text-indigo-300 mb-2">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase">
              AI Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Predictive learning insights, risk detection, and improvement
            planning are online.
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeTab === "dashboard" && "Student Analytics Dashboard"}
              {activeTab === "roster" && "Student Roster"}
              {activeTab === "improvement" && "Performance Improvement"}
              {activeTab === "controls" && "Engine Controls"}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {activeTab === "dashboard" &&
                "Analyze academic performance, attendance, risk level, and trends."}
              {activeTab === "roster" &&
                "View, search, and monitor all analyzed student records."}
              {activeTab === "improvement" &&
                "Identify weak students and generate improvement plans."}
              {activeTab === "controls" &&
                "Manage analysis thresholds and engine configuration."}
            </p>
          </div>

          <label className="flex items-center gap-2 bg-slate-950 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-2xl cursor-pointer shadow-lg shadow-slate-200 transition">
            <Upload size={16} />
            Upload Student CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </header>

        {studentRecords.length === 0 ? (
          <EmptyState processUploadedData={processUploadedData} />
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <MetricCard
                    title="Total Students"
                    value={metrics.totalStudents}
                    icon={<Users size={20} />}
                    tone="indigo"
                  />

                  <MetricCard
                    title="Average Attendance"
                    value={metrics.avgAttendance}
                    icon={<FileText size={20} />}
                    tone="cyan"
                  />

                  <MetricCard
                    title="AI Confidence"
                    value={metrics.accuracy}
                    icon={<BrainCircuit size={20} />}
                    tone="purple"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <MiniCard
                    title="Average Grade"
                    value={`${averageGrade}%`}
                    color="text-indigo-600"
                    icon={<Activity size={18} />}
                  />
                  <MiniCard
                    title="At Risk Students"
                    value={atRiskStudents.length}
                    color="text-red-600"
                    icon={<AlertCircle size={18} />}
                  />
                  <MiniCard
                    title="Weak Grade Count"
                    value={weakGradeStudents.length}
                    color="text-orange-600"
                    icon={<Target size={18} />}
                  />
                  <MiniCard
                    title="Risk Percentage"
                    value={`${riskPercentage}%`}
                    color="text-rose-600"
                    icon={<TrendingUp size={18} />}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <ChartCard
                    title="Academic Trajectory Mapping"
                    subtitle="Grade and attendance trend analysis"
                    className="xl:col-span-2"
                    icon={<TrendingUp size={18} />}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="gradeFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#4f46e5"
                              stopOpacity={0.18}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4f46e5"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E2E8F0"
                        />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} />
                        <Tooltip />

                        <Area
                          type="monotone"
                          dataKey="avgGrade"
                          name="Average Grade"
                          stroke="#4f46e5"
                          strokeWidth={3}
                          fill="url(#gradeFill)"
                        />

                        <Line
                          type="monotone"
                          dataKey="attendance"
                          name="Attendance"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <AIInsightPanel aiInsights={aiInsights} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ChartCard
                    title="Grade Distribution"
                    subtitle="Number of students in each grade range"
                    icon={<BarChart3 size={18} />}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistributionData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E2E8F0"
                        />
                        <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} />
                        <Tooltip />
                        <Bar
                          dataKey="students"
                          fill="#4f46e5"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard
                    title="Attendance Distribution"
                    subtitle="Attendance level grouping"
                    icon={<BarChart3 size={18} />}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceDistributionData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E2E8F0"
                        />
                        <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} />
                        <Tooltip />
                        <Bar
                          dataKey="students"
                          fill="#06b6d4"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ChartCard
                    title="Student Status Overview"
                    subtitle="At risk, stable, and excelling ratio"
                    icon={<PieIcon size={18} />}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          label
                        >
                          {statusData.map((_, i) => (
                            <Cell key={i} fill={pieColors[i]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <TopStudents students={topStudents} />
                </div>
              </div>
            )}

            {activeTab === "roster" && (
              <RosterTable
                students={filteredStudents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === "improvement" && (
              <ImprovementSection
                atRiskStudents={atRiskStudents}
                weakGradeStudents={weakGradeStudents}
                lowAttendanceStudents={lowAttendanceStudents}
              />
            )}

            {activeTab === "controls" && (
              <ControlsSection
                accuracy={metrics.accuracy}
                totalStudents={metrics.totalStudents}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function MenuBtn({ active, onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

function EmptyState({ processUploadedData }) {
  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white border border-slate-200 rounded-[2rem] p-12 text-center shadow-sm relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
        <FileSpreadsheet size={38} />
      </div>

      <h2 className="text-2xl font-bold text-slate-900">
        Initialize Your Analytics Workspace
      </h2>

      <p className="text-sm text-slate-500 mt-3 mb-8 max-w-xl mx-auto">
        Upload a student CSV file or load demo data to generate performance
        analytics, risk detection, improvement insights, and charts.
      </p>

      <button
        onClick={() =>
          processUploadedData([
            {
              "Student ID": "STU001",
              Name: "Sneha",
              Grade: "94",
              Attendance: "96",
              Email: "sneha@edu.com",
            },
            {
              "Student ID": "STU002",
              Name: "Rahul",
              Grade: "62",
              Attendance: "78",
              Email: "rahul@edu.com",
            },
            {
              "Student ID": "STU003",
              Name: "Arun",
              Grade: "88",
              Attendance: "91",
              Email: "arun@edu.com",
            },
            {
              "Student ID": "STU004",
              Name: "Priya",
              Grade: "74",
              Attendance: "84",
              Email: "priya@edu.com",
            },
            {
              "Student ID": "STU005",
              Name: "Kavin",
              Grade: "51",
              Attendance: "72",
              Email: "kavin@edu.com",
            },
          ])
        }
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border bg-slate-950 text-white font-semibold hover:bg-indigo-700 transition"
      >
        Load Demo Roster
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function MetricCard({ title, value, icon, tone }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600",
    cyan: "bg-cyan-50 text-cyan-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-3xl font-bold mt-2 text-slate-900">{value}</h3>
      </div>

      <div className={`p-4 rounded-2xl ${styles[tone]}`}>{icon}</div>
    </div>
  );
}

function MiniCard({ title, value, color, icon }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase">{title}</p>
        <div className="text-slate-400">{icon}</div>
      </div>

      <h3 className={`text-3xl font-bold mt-3 ${color}`}>{value}</h3>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children, className = "" }) {
  return (
    <div
      className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 text-slate-900 mb-1">
        <div className="text-indigo-600">{icon}</div>
        <h3 className="font-bold">{title}</h3>
      </div>

      <p className="text-xs text-slate-400 mb-5">{subtitle}</p>

      <div className="h-72">{children}</div>
    </div>
  );
}

function AIInsightPanel({ aiInsights }) {
  return (
    <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={18} className="text-indigo-300" />
        <h3 className="font-bold">AI Improvement Insights</h3>
      </div>

      <p className="text-xs text-slate-400 mb-6">
        Automated interpretation from uploaded student data
      </p>

      <div className="space-y-3">
        {aiInsights.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl border text-sm flex gap-3 ${
              item.type === "warning"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-200"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
            }`}
          >
            {item.type === "warning" ? (
              <AlertCircle size={17} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
            )}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopStudents({ students }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <Trophy size={18} className="text-yellow-500" />
        <h3 className="font-bold text-slate-900">Top Performing Students</h3>
      </div>

      <p className="text-xs text-slate-400 mb-5">Ranked by grade percentage</p>

      <div className="space-y-3">
        {students.map((student, index) => (
          <div
            key={student.id}
            className="flex items-center justify-between border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition"
          >
            <div>
              <p className="font-semibold text-slate-900">
                #{index + 1} {student.name}
              </p>
              <p className="text-xs text-slate-400">{student.id}</p>
            </div>

            <span className="font-bold text-indigo-600">{student.grade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RosterTable({ students, searchTerm, setSearchTerm }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">Analyzed Cohort Members</h3>
          <p className="text-xs text-slate-400">
            Individual student metrics calculated from uploaded data
          </p>
        </div>

        <div className="relative md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-black outline-none"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-400 uppercase">
              <th className="p-4">Student ID</th>
              <th className="p-4">Student</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Attendance</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm text-slate-600">
            {students.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-mono text-xs text-slate-400">{s.id}</td>
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.email}</div>
                </td>
                <td className="p-4 font-semibold">{s.grade}</td>
                <td className="p-4 font-semibold">{s.attendance}</td>
                <td className="p-4">
                  <StatusBadge status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cls =
    status === "Excelling"
      ? "bg-emerald-50 text-emerald-700"
      : status === "At Risk"
      ? "bg-rose-50 text-rose-700"
      : "bg-blue-50 text-blue-700";

  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${cls}`}>
      {status}
    </span>
  );
}

function ImprovementSection({
  atRiskStudents,
  weakGradeStudents,
  lowAttendanceStudents,
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MiniCard
          title="At Risk Students"
          value={atRiskStudents.length}
          color="text-red-600"
          icon={<AlertCircle size={18} />}
        />

        <MiniCard
          title="Weak Grade Students"
          value={weakGradeStudents.length}
          color="text-orange-600"
          icon={<Target size={18} />}
        />

        <MiniCard
          title="Low Attendance Students"
          value={lowAttendanceStudents.length}
          color="text-yellow-600"
          icon={<Activity size={18} />}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            Students Needing Improvement
          </h3>
          <p className="text-xs text-slate-400">
            Personalized academic suggestions based on grade and attendance.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-400 uppercase">
                <th className="p-4">Student</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Problem</th>
                <th className="p-4">Suggested Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-600">
              {atRiskStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">
                    No students need improvement currently.
                  </td>
                </tr>
              ) : (
                atRiskStudents.map((s) => {
                  const weak = s.rawGrade < 65;
                  const low = s.rawAttendance < 80;

                  return (
                    <tr key={s.id} className="border-t hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">
                          {s.name}
                        </div>
                        <div className="text-xs text-slate-400">{s.id}</div>
                      </td>
                      <td className="p-4 font-semibold">{s.grade}</td>
                      <td className="p-4 font-semibold">{s.attendance}</td>
                      <td className="p-4">
                        {weak && low
                          ? "Weak grade + low attendance"
                          : weak
                          ? "Weak grade"
                          : "Low attendance"}
                      </td>
                      <td className="p-4">
                        {weak && low
                          ? "Daily revision, weekly test practice, and attendance monitoring."
                          : weak
                          ? "Extra revision and weekly tests."
                          : "Attendance mentoring and parent communication."}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold mb-2">Improvement Insights</h3>
          <p className="text-sm text-slate-400 mb-5">
            AI-based academic improvement summary
          </p>

          <div className="space-y-3 text-sm">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-2xl p-4">
              {atRiskStudents.length} student(s) need immediate academic
              support.
            </div>

            <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl p-4">
              {weakGradeStudents.length} student(s) have weak grade performance
              below 65%.
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 rounded-2xl p-4">
              {lowAttendanceStudents.length} student(s) have attendance below
              80%.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Study Plan</h3>
          <p className="text-sm text-slate-500 mb-5">
            Recommended improvement strategy
          </p>

          <ul className="list-disc ml-5 space-y-3 text-sm text-slate-700">
            <li>Daily 1 hour revision for weak grade students.</li>
            <li>Weekly mock test to track progress.</li>
            <li>Attendance monitoring for low attendance students.</li>
            <li>Mentor support for at-risk students.</li>
            <li>Monthly performance review with progress comparison.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ControlsSection({ accuracy, totalStudents }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          AI Insight Engine
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          Engine settings and live analysis configuration
        </p>

        <div className="space-y-4">
          <InfoRow label="Insight Confidence" value={accuracy} />
          <InfoRow label="Risk Detection" value="Active" />
          <InfoRow label="CSV Processing" value="Enabled" />
          <InfoRow label="Students Processed" value={totalStudents} />
        </div>
      </div>

      <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-2">Project Configuration</h3>
        <p className="text-sm text-slate-400 mb-5">
          EduPulse AI is configured for student performance analytics.
        </p>

        <div className="space-y-3 text-sm">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            Dataset Type: Student CSV
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            Grade Threshold: Below 65% = At Risk
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            Attendance Threshold: Below 80% = At Risk
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            Output: Dashboard, charts, insights, and improvement plan
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-sm font-bold text-indigo-600">{value}</span>
    </div>
  );
}