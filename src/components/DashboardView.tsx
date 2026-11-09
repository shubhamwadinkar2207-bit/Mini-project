import React from 'react';
import {
  Users,
  BookOpen,
  CalendarDays,
  TrendingUp,
  UserPlus,
  Search,
  Download,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Student, ActivePage } from '../types/student';
import { COURSES_LIST, SEMESTER_LIST } from '../utils/studentLogic';

interface DashboardViewProps {
  students: Student[];
  onNavigate: (page: ActivePage) => void;
  onExportCSV: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onNavigate,
  onExportCSV,
}) => {
  const totalStudents = students.length;

  // Unique active courses
  const uniqueCourses = Array.from(new Set(students.map((s) => s.course)));
  const coursesCount = uniqueCourses.length;

  // Unique active semesters
  const uniqueSemesters = Array.from(new Set(students.map((s) => s.semester)));
  const semestersCount = uniqueSemesters.length;

  // Course distribution counts
  const courseCounts: Record<string, number> = {};
  COURSES_LIST.forEach((c) => {
    courseCounts[c] = 0;
  });
  students.forEach((s) => {
    courseCounts[s.course] = (courseCounts[s.course] || 0) + 1;
  });

  const maxCourseCount = Math.max(...Object.values(courseCounts), 1);

  // Semester distribution counts
  const semesterCounts: Record<string, number> = {};
  SEMESTER_LIST.forEach((sem) => {
    semesterCounts[sem] = 0;
  });
  students.forEach((s) => {
    semesterCounts[s.semester] = (semesterCounts[s.semester] || 0) + 1;
  });

  const maxSemCount = Math.max(...Object.values(semesterCounts), 1);

  // Recent 5 students (newest first)
  const recentStudents = [...students].slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-blue-600 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Registered Students
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
            {totalStudents}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalStudents > 0
              ? 'Active database records enrolled'
              : 'No records registered yet'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-indigo-600 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Courses / Branches
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-indigo-900 tracking-tight">
            {coursesCount}{' '}
            <span className="text-base font-semibold text-slate-400">
              / {COURSES_LIST.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Engineering & technology branches
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-sky-600 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Semesters
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
            {semestersCount}{' '}
            <span className="text-base font-semibold text-slate-400">
              / {SEMESTER_LIST.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Academic semesters represented
          </p>
        </div>
      </div>

      {totalStudents === 0 ? (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900">
            No Students Registered Yet
          </h3>
          <p className="text-sm text-blue-700 max-w-md mx-auto">
            Your database is currently empty. Get started by registering your first student record or importing from a JSON file.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register First Student</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Students per Course */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>📊</span> Students per Course
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  {COURSES_LIST.length} Branches
                </span>
              </div>
              <div className="mt-4 space-y-3.5">
                {COURSES_LIST.map((course) => {
                  const count = courseCounts[course] || 0;
                  const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                  const barWidth = totalStudents > 0 ? (count / maxCourseCount) * 100 : 0;

                  return (
                    <div key={course} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 truncate max-w-[240px]">
                          {course}
                        </span>
                        <span className="text-blue-700 font-bold shrink-0">
                          {count}{' '}
                          <span className="text-slate-400 font-normal">
                            ({percentage.toFixed(0)}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(barWidth, count > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Students per Semester */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>📈</span> Students per Semester
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  Semesters 1 - 8
                </span>
              </div>

              {/* Column bar graph representation */}
              <div className="mt-6 flex items-end justify-between gap-2 h-44 pt-4 px-2 border-b border-slate-200">
                {SEMESTER_LIST.map((sem, idx) => {
                  const count = semesterCounts[sem] || 0;
                  const heightPercent = maxSemCount > 0 ? (count / maxSemCount) * 100 : 0;
                  const isTop = count === maxSemCount && count > 0;

                  return (
                    <div
                      key={sem}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip on hover */}
                      <span className="text-[11px] font-bold text-slate-700 mb-1 opacity-90 group-hover:scale-110 transition-transform">
                        {count}
                      </span>
                      <div className="w-full max-w-[32px] bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            isTop
                              ? 'bg-blue-600 shadow-sm shadow-blue-500/40'
                              : 'bg-blue-400 group-hover:bg-blue-500'
                          }`}
                          style={{ height: `${Math.max(heightPercent, count > 0 ? 8 : 2)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 mt-2">
                        S{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>S1: First Year</span>
                <span>S4: Second Year (SE)</span>
                <span>S8: Final Year</span>
              </div>
            </div>
          </div>

          {/* Recently Registered Students Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>🕒</span> Recently Registered Students
                </h3>
                <p className="text-xs text-slate-500">
                  Latest student additions in the database
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('view_all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <span>View All ({totalStudents})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Course / Branch</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentStudents.map((student) => (
                    <tr
                      key={student.roll_no}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {student.roll_no}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {student.course}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {student.semester}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                        📞 {student.phone}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onNavigate('search')}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          Find Profile →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">
              Need to add or locate student records quickly?
            </h4>
            <p className="text-xs text-slate-300">
              EduTrack supports real-time search, quick updates, and safe record deletion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student</span>
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
