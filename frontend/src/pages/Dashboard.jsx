import React, { useState } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Users, FileText, BrainCircuit, TrendingUp, AlertCircle, Search, 
  Upload, FileSpreadsheet, LayoutDashboard, GraduationCap, 
  Settings, HelpCircle, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const [studentRecords, setStudentRecords] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [metrics, setMetrics] = useState({ totalStudents: 0, avgAttendance: 0, accuracy: "92%" });
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processUploadedData(results.data);
      },
      error: () => {
        alert("Failed to parse CSV file. Please check the format.");
      }
    });
  };

  const processUploadedData = (data) => {
    const formattedStudents = data.map((row, index) => {
      const gradeVal = parseFloat(row.Grade) || 0;
      const attendanceVal = parseFloat(row.Attendance) || 0;
      
      let status = "Stable";
      if (gradeVal >= 85) status = "Excelling";
      if (attendanceVal < 80 || gradeVal < 65) status = "At Risk";

      return {
        id: row["Student ID"] || `STU${String(index + 1).padStart(3, '0')}`,
        name: row.Name || "Unknown Student",
        grade: `${gradeVal}%`,
        attendance: `${attendanceVal}%`,
        rawGrade: gradeVal,
        rawAttendance: attendanceVal,
        status: status,
        email: row.Email || `${(row.Name || 'student').toLowerCase().replace(/\s+/g, '')}@edu.com`
      };
    });

    const total = formattedStudents.length;
    const avgAttendance = total > 0 
      ? Math.round(formattedStudents.reduce((acc, s) => acc + s.rawAttendance, 0) / total) 
      : 0;

    const mockTimeline = [
      { month: 'Jan', avgGrade: Math.max(60, avgAttendance - 12), attendance: Math.max(70, avgAttendance - 2) },
      { month: 'Feb', avgGrade: Math.max(64, avgAttendance - 10), attendance: Math.max(70, avgAttendance - 3) },
      { month: 'Mar', avgGrade: Math.max(72, avgAttendance - 5), attendance: Math.max(72, avgAttendance + 1) },
      { month: 'Apr', avgGrade: Math.max(68, avgAttendance - 7), attendance: Math.max(70, avgAttendance - 4) },
      { month: 'May', avgGrade: Math.round(formattedStudents.reduce((acc, s) => acc + s.rawGrade, 0) / total) || 75, attendance: avgAttendance },
    ];

    setStudentRecords(formattedStudents);
    setChartData(mockTimeline);
    setMetrics({ totalStudents: total, avgAttendance: `${avgAttendance}%`, accuracy: "98.4%" });
    generateAIInsights(formattedStudents, avgAttendance);
  };

  const generateAIInsights = (students, avgAttendance) => {
    const atRiskCount = students.filter(s => s.status === "At Risk").length;
    const excellingCount = students.filter(s => s.status === "Excelling").length;
    const insights = [];
    
    if (atRiskCount > 0) {
      insights.push({
        type: "warning",
        text: `AI Model Flagged ${atRiskCount} students exhibiting early drop-out parameters. Focus intervention on lower attendance patterns.`
      });
    }
    if (avgAttendance >= 85) {
      insights.push({
        type: "success",
        text: `Cohort health check passed. Attendance levels match a high-performing benchmark distribution.`
      });
    }
    if (excellingCount > 0) {
      insights.push({
        type: "success",
        text: `${excellingCount} students qualify for advanced placement options based on continuous grading metrics.`
      });
    }
    setAiInsights(insights);
  };

  const filteredStudents = studentRecords.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex">
      
      {/* 1. Left Navigation Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 p-5 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200">
              <BrainCircuit size={22} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base block tracking-tight">EduPulse AI</span>
              <span className="text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">Analytics Panel</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "dashboard" 
                  ? "bg-indigo-50/80 text-indigo-700 font-semibold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200">
              <GraduationCap size={18} /> Student Roster
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200">
              <Settings size={18} /> Engine Controls
            </button>
          </nav>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Sparkles size={16} />
            <span className="text-xs font-bold tracking-wide uppercase">Gemini Core Active</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">Predictive learning trajectories are online.</p>
        </div>
      </aside>

      {/* 2. Main Studio Window */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
        
        {/* Dynamic Context Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roster Analysis</h1>
            <p className="text-sm text-slate-500 mt-0.5">Parse educational metrics instantly using zero-configuration modeling</p>
          </div>
          
          <label className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm shadow-slate-900/10 cursor-pointer hover:-translate-y-0.5 active:translate-y-0">
            <Upload size={16} />
            <span>Upload Student CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </header>

        {studentRecords.length === 0 ? (
          
          /* Modernized Interactive Dropzone Empty State */
          <div className="max-w-2xl mx-auto mt-12 bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm relative group transition-all duration-300 hover:border-indigo-300">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
            <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-between p-4 text-indigo-600 mb-5 group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet size={32} className="mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Initialize Your Workspace</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Drop or load an evaluation spreadsheet to map grades, check risks, and display models.
            </p>
            <button 
              onClick={() => processUploadedData([
                { "Student ID": "STU001", Name: "Sarah Jenkins", Grade: "94", Attendance: "96", Email: "s.jenkins@edu.com" },
                { "Student ID": "STU002", Name: "Michael Chang", Grade: "62", Attendance: "78", Email: "m.chang@edu.com" },
                { "Student ID": "STU003", Name: "Amara Okafor", Grade: "88", Attendance: "91", Email: "a.okafor@edu.com" },
                { "Student ID": "STU004", Name: "David Miller", Grade: "74", Attendance: "84", Email: "d.miller@edu.com" }
              ])}
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all duration-200"
            >
              <span>Load Synthetic Demo Roster</span>
              <ChevronRight size={14} />
            </button>
          </div>

        ) : (
          
          /* Dashboard Main Presentation Grid */
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cohort Roster</span>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{metrics.totalStudents}</h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={20} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mean Attendance</span>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{metrics.avgAttendance}</h3>
                </div>
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><FileText size={20} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Insight Confidence</span>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{metrics.accuracy}</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BrainCircuit size={20} /></div>
              </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Chart Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Academic Trajectory Mapping</h3>
                  <p className="text-xs text-slate-400 mb-6">Historical trends compiled against active attendance timelines</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} />
                      <Area type="monotone" dataKey="avgGrade" name="Avg Grade (%)" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrade)" />
                      <Line type="monotone" dataKey="attendance" name="Attendance Rate" stroke="#06b6d4" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Enhanced Interactive AI Insights Box */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl text-white flex flex-col justify-between shadow-xl shadow-slate-950/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={18} className="text-indigo-400 animate-pulse" />
                    <h3 className="text-base font-bold tracking-tight">Gemini Automated Insights</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">Real-time analytical interpretations of your dataset</p>
                  
                  <div className="space-y-3.5">
                    {aiInsights.map((insight, index) => (
                      <div 
                        key={index} 
                        className={`p-3.5 rounded-xl border text-xs flex gap-2.5 backdrop-blur-md ${
                          insight.type === 'warning' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                        }`}
                      >
                        {insight.type === 'warning' ? (
                          <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                        ) : (
                          <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                        )}
                        <span className="leading-relaxed">{insight.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Inference System: v2.1</span>
                  <span>Calculated Instantly</span>
                </div>
              </div>
            </div>

            {/* Roster Data Grid Container */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Analyzed Cohort Members</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Individual metrics calculated from your file</p>
                </div>
                <div className="relative sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Quick search by name or ID..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-150 text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Student ID</th>
                      <th className="p-4">Identity Profile</th>
                      <th className="p-4">Grade Metrics</th>
                      <th className="p-4">Attendance Performance</th>
                      <th className="p-4 pr-6">AI Evaluation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors duration-100">
                        <td className="p-4 pl-6 font-mono text-xs text-slate-400 font-medium">{student.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-400">{student.email}</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{student.grade}</td>
                        <td className="p-4 text-slate-500 font-medium">{student.attendance}</td>
                        <td className="p-4 pr-6">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ${
                            student.status === 'Excelling' ? 'bg-emerald-50 text-emerald-700' :
                            student.status === 'At Risk' ? 'bg-rose-50 text-rose-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}