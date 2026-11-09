import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Calendar,
  Phone,
  User,
  Hash,
  ArrowRight,
} from 'lucide-react';
import { Student, ActivePage } from '../types/student';
import { COURSES_LIST, SEMESTER_LIST, validateInputs } from '../utils/studentLogic';

interface RegisterStudentViewProps {
  onAddStudent: (student: Omit<Student, 'createdAt'>) => { success: boolean; message: string };
  onNavigate: (page: ActivePage) => void;
}

export const RegisterStudentView: React.FC<RegisterStudentViewProps> = ({
  onAddStudent,
  onNavigate,
}) => {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(COURSES_LIST[0]);
  const [semester, setSemester] = useState('Semester 4'); // Default from Streamlit script

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    registeredRoll?: string;
  } | null>(null);

  const [touched, setTouched] = useState<{
    rollNo?: boolean;
    name?: boolean;
    phone?: boolean;
  }>({});

  const handlePhoneChange = (val: string) => {
    // Keep only numbers and max 10 characters
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ rollNo: true, name: true, phone: true });

    // Validate inputs
    const validation = validateInputs(rollNo, name, phone);
    if (!validation.isValid) {
      setStatusMessage({
        type: 'error',
        text: validation.message,
      });
      return;
    }

    const res = onAddStudent({
      roll_no: rollNo.trim(),
      name: name.trim(),
      course,
      semester,
      phone: phone.trim(),
    });

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message,
        registeredRoll: rollNo.trim(),
      });
      // Clear inputs
      setRollNo('');
      setName('');
      setPhone('');
      setTouched({});
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleReset = () => {
    setRollNo('');
    setName('');
    setPhone('');
    setCourse(COURSES_LIST[0]);
    setSemester('Semester 4');
    setStatusMessage(null);
    setTouched({});
  };

  // Inline validation checks
  const isRollInvalid = touched.rollNo && !rollNo.trim();
  const isNameInvalid =
    touched.name &&
    (!name.trim() || name.trim().length < 2 || !/^[A-Za-z\s.]+$/.test(name.trim()));
  const isPhoneInvalid = touched.phone && !/^\d{10}$/.test(phone.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Feedback Toast/Banner */}
      {statusMessage && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <h4 className="font-bold text-sm">
              {statusMessage.type === 'success' ? 'Registration Successful!' : 'Validation Error'}
            </h4>
            <p className="text-sm mt-0.5">{statusMessage.text}</p>

            {statusMessage.type === 'success' && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('view_all')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <span>View in All Students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium cursor-pointer"
                >
                  Register Another Student
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Registration Form Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Details Form</h2>
              <p className="text-xs text-slate-500">
                All fields marked with an asterisk (<span className="text-rose-500">*</span>) are mandatory
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Reset form fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Roll Number */}
              <div>
                <label
                  htmlFor="roll_no"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Roll Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    id="roll_no"
                    name="roll_no"
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, rollNo: true }))}
                    placeholder="e.g., 59 or IT2026-059"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all ${
                      isRollInvalid
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    required
                  />
                </div>
                {isRollInvalid ? (
                  <p className="mt-1 text-xs text-rose-600">Roll number cannot be empty.</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Primary Key: Unique identifier across the entire college database.
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="e.g., Soham Nitin Dalal"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all ${
                      isNameInvalid
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    required
                  />
                </div>
                {isNameInvalid ? (
                  <p className="mt-1 text-xs text-rose-600">
                    Full name must be at least 2 letters (letters and spaces only).
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the student's legal academic name.
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                    placeholder="e.g., 9876543210"
                    className={`w-full pl-9 pr-3.5 py-2.5 text-sm font-mono rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all ${
                      isPhoneInvalid
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    required
                  />
                </div>
                {isPhoneInvalid ? (
                  <p className="mt-1 text-xs text-rose-600">
                    Must be exactly 10 numeric digits (currently {phone.length}/10).
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    10-digit mobile number for administrative contact.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Course / Branch */}
              <div>
                <label
                  htmlFor="course"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Course / Branch <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <select
                    id="course"
                    name="course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    {COURSES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Select the engineering or computer science department.
                </p>
              </div>

              {/* Current Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Current Semester <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    id="semester"
                    name="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    {SEMESTER_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Defaults to Semester 4 (Second Year IT/Engg).
                </p>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Registration Card Preview:
                </span>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Roll No: {rollNo || '—'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-base">
                  {name || 'Student Name Preview'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  <strong>Course:</strong> {course}
                </div>
                <div className="text-xs text-slate-600">
                  <strong>Semester:</strong> {semester}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  <strong>Phone:</strong> {phone ? `📞 ${phone}` : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Save Student Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
