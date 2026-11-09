import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  Phone,
  User,
  Edit2,
  Trash2,
  Copy,
  Check,
  Table as TableIcon,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { Student, ActivePage } from '../types/student';
import { searchStudentsLogic } from '../utils/studentLogic';

interface SearchStudentViewProps {
  students: Student[];
  onNavigate: (page: ActivePage) => void;
  onSelectForEdit: (rollNo: string) => void;
  onSelectForDelete: (rollNo: string) => void;
}

export const SearchStudentView: React.FC<SearchStudentViewProps> = ({
  students,
  onNavigate,
  onSelectForEdit,
  onSelectForDelete,
}) => {
  const [query, setQuery] = useState('');
  const [copiedRoll, setCopiedRoll] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const results = searchStudentsLogic(students, query);

  const handleCopyPhone = (phone: string, roll: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedRoll(roll);
    setTimeout(() => setCopiedRoll(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <label
            htmlFor="search_input"
            className="block text-sm font-bold text-slate-800 mb-2"
          >
            🔍 Search by Roll Number or Name:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="search_input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type roll number (e.g. 59) or name (e.g. Soham)..."
              className="w-full pl-11 pr-10 py-3 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 shadow-2xs"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        {students.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Quick suggestions:</span>
            {students.slice(0, 4).map((s) => (
              <button
                key={s.roll_no}
                onClick={() => setQuery(s.roll_no)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                Roll {s.roll_no} ({s.name.split(' ')[0]})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Section */}
      {query.trim() === '' ? (
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-blue-900 text-base">Search Database Instantly</h4>
          <p className="text-sm text-blue-700 max-w-md mx-auto">
            Type any roll number, first name, last name, or phone number above to instantly search through all {students.length} student records.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-amber-900 text-base">
            No Student Found Matching '{query}'
          </h4>
          <p className="text-sm text-amber-800 max-w-md mx-auto">
            Please verify the roll number or spelling of the student's name, or register them in the system.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Register This Student
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <span>🎯</span>
              <span>
                Found {results.length} matching {results.length === 1 ? 'record' : 'records'}:
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>

          {/* Cards View (Faithfully styled to .student-card in Streamlit CSS) */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((student) => (
                <div
                  key={student.roll_no}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Roll No: {student.roll_no}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectForEdit(student.roll_no)}
                        title="Edit Student"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectForDelete(student.roll_no)}
                        title="Delete Student"
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-2.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{student.name}</span>
                  </h3>

                  <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-700">Course:</strong> {student.course}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-700">Semester:</strong> {student.semester}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-mono text-xs text-slate-700">
                          <strong>Phone:</strong> {student.phone}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyPhone(student.phone, student.roll_no)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-700 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {copiedRoll === student.roll_no ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Tabular View (Matching Streamlit "Tabular View as well") */
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Semester</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {results.map((student) => (
                      <tr key={student.roll_no} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {student.roll_no}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {student.name}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{student.course}</td>
                        <td className="py-3 px-4 text-slate-700">{student.semester}</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">
                          {student.phone}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectForEdit(student.roll_no)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 mr-2 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onSelectForDelete(student.roll_no)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
