import React, { useState, useMemo } from 'react';
import {
  Download,
  Filter,
  Search,
  UserPlus,
  Copy,
  Check,
  Edit2,
  Trash2,
  Database,
  ArrowUpDown,
} from 'lucide-react';
import { Student, ActivePage } from '../types/student';
import { COURSES_LIST, SEMESTER_LIST, exportToCSV } from '../utils/studentLogic';

interface ViewAllStudentsViewProps {
  students: Student[];
  onNavigate: (page: ActivePage) => void;
  onSelectForEdit: (rollNo: string) => void;
  onSelectForDelete: (rollNo: string) => void;
  onExportJSON: () => void;
}

export const ViewAllStudentsView: React.FC<ViewAllStudentsViewProps> = ({
  students,
  onNavigate,
  onSelectForEdit,
  onSelectForDelete,
  onExportJSON,
}) => {
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRoll, setCopiedRoll] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<'roll_no' | 'name' | 'course' | 'semester'>('roll_no');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter options
  const courseOptions = ['All Courses', ...COURSES_LIST];
  const semesterOptions = ['All Semesters', ...SEMESTER_LIST];

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesCourse = selectedCourse === 'All Courses' || s.course === selectedCourse;
        const matchesSemester =
          selectedSemester === 'All Semesters' || s.semester === selectedSemester;
        const matchesQuery =
          !searchQuery.trim() ||
          s.roll_no.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          s.phone.includes(searchQuery.trim());
        return matchesCourse && matchesSemester && matchesQuery;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Numerical roll number sort if both are digits
        if (sortField === 'roll_no' && /^\d+$/.test(valA) && /^\d+$/.test(valB)) {
          return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        }

        const comp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
        return sortAsc ? comp : -comp;
      });
  }, [students, selectedCourse, selectedSemester, searchQuery, sortField, sortAsc]);

  const handleCopyPhone = (phone: string, roll: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedRoll(roll);
    setTimeout(() => setCopiedRoll(null), 2000);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(filteredStudents);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_database_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: 'roll_no' | 'name' | 'course' | 'semester') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter 1: Course */}
          <div>
            <label
              htmlFor="filter_course"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Filter by Course:
            </label>
            <div className="relative">
              <select
                id="filter_course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all cursor-pointer"
              >
                {courseOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter 2: Semester */}
          <div>
            <label
              htmlFor="filter_semester"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Filter by Semester:
            </label>
            <div className="relative">
              <select
                id="filter_semester"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full text-xs font-medium py-2.5 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all cursor-pointer"
              >
                {semesterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search in table */}
          <div>
            <label
              htmlFor="filter_search"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Quick Search:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                id="filter_search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Roll, Name, Phone..."
                className="w-full text-xs py-2.5 pl-8 pr-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Metric Status */}
          <div className="flex flex-col justify-end">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Records Found:</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {filteredStudents.length} of {students.length}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(selectedCourse !== 'All Courses' ||
              selectedSemester !== 'All Semesters' ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCourse('All Courses');
                  setSelectedSemester('All Semesters');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              disabled={filteredStudents.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Records as CSV</span>
            </button>

            <button
              onClick={onExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => onNavigate('register')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">No Matching Records Found</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              No students match your active filters or search criteria. Try loosening filters or register a new record.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCourse('All Courses');
                  setSelectedSemester('All Semesters');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Register New Student
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th
                    onClick={() => handleSort('roll_no')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Roll Number</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Full Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('course')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Course / Branch</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('semester')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Semester</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.roll_no}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    {/* Roll No badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Roll No: {student.roll_no}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {student.name}
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {student.course}
                      </span>
                    </td>

                    {/* Semester */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        {student.semester}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-xs">
                      <div className="inline-flex items-center gap-1.5">
                        <span>📞 {student.phone}</span>
                        <button
                          onClick={() => handleCopyPhone(student.phone, student.roll_no)}
                          title="Copy phone number"
                          className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                        >
                          {copiedRoll === student.roll_no ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onSelectForEdit(student.roll_no)}
                          title="Edit this student"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectForDelete(student.roll_no)}
                          title="Delete this record"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
