import React, { useState, useEffect } from 'react';
import {
  UserPen,
  Save,
  CheckCircle2,
  AlertCircle,
  Hash,
  User,
  Phone,
  BookOpen,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Student, ActivePage } from '../types/student';
import { COURSES_LIST, SEMESTER_LIST, validateInputs } from '../utils/studentLogic';

interface UpdateStudentViewProps {
  students: Student[];
  initialSelectedRoll?: string;
  onUpdateStudent: (
    rollNo: string,
    updatedFields: { name: string; course: string; semester: string; phone: string }
  ) => { success: boolean; message: string };
  onNavigate: (page: ActivePage) => void;
}

export const UpdateStudentView: React.FC<UpdateStudentViewProps> = ({
  students,
  initialSelectedRoll,
  onUpdateStudent,
  onNavigate,
}) => {
  const [selectedRoll, setSelectedRoll] = useState<string>(
    initialSelectedRoll || (students.length > 0 ? students[0].roll_no : '')
  );

  const [name, setName] = useState('');
  const [course, setCourse] = useState(COURSES_LIST[0]);
  const [semester, setSemester] = useState(SEMESTER_LIST[0]);
  const [phone, setPhone] = useState('');

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Update selectedRoll if initialSelectedRoll changes
  useEffect(() => {
    if (initialSelectedRoll && students.some((s) => s.roll_no === initialSelectedRoll)) {
      setSelectedRoll(initialSelectedRoll);
    } else if (students.length > 0 && !selectedRoll) {
      setSelectedRoll(students[0].roll_no);
    }
  }, [initialSelectedRoll, students]);

  // Load selected student data into form inputs
  useEffect(() => {
    const target = students.find((s) => s.roll_no === selectedRoll);
    if (target) {
      setName(target.name);
      setCourse(target.course);
      setSemester(target.semester);
      setPhone(target.phone);
      setStatusMessage(null);
    }
  }, [selectedRoll, students]);

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateInputs(selectedRoll, name, phone);
    if (!validation.isValid) {
      setStatusMessage({
        type: 'error',
        text: validation.message,
      });
      return;
    }

    const res = onUpdateStudent(selectedRoll, {
      name: name.trim(),
      course,
      semester,
      phone: phone.trim(),
    });

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-3">
        <h4 className="font-bold text-amber-900 text-base">No Students Available to Update</h4>
        <p className="text-sm text-amber-800">
          The database has no students registered yet. Please register a student first.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          Register Student
        </button>
      </div>
    );
  }

  const currentStudent = students.find((s) => s.roll_no === selectedRoll);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Selector Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <label
          htmlFor="select_student_update"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Select Student to Update:
        </label>
        <div className="relative">
          <select
            id="select_student_update"
            value={selectedRoll}
            onChange={(e) => setSelectedRoll(e.target.value)}
            className="w-full text-sm font-semibold py-2.5 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.roll_no} value={s.roll_no}>
                {s.roll_no} - {s.name} ({s.course}, {s.semester})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Feedback */}
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
              {statusMessage.type === 'success' ? 'Update Saved Successfully!' : 'Update Error'}
            </h4>
            <p className="text-sm mt-0.5">{statusMessage.text}</p>

            {statusMessage.type === 'success' && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('view_all')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <span>View All Students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {currentStudent && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <UserPen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Student Information
                </h3>
                <p className="text-xs text-slate-500">
                  Editing record for Roll No: <span className="font-bold text-blue-700">{selectedRoll}</span>
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Primary Key Protected
            </span>
          </div>

          <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Roll Number (Fixed) */}
                <div>
                  <label
                    htmlFor="update_roll_no"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >
                    Roll Number (Primary Key - Fixed)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="update_roll_no"
                      type="text"
                      value={selectedRoll}
                      disabled
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-mono font-semibold"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Primary keys are immutable to preserve data integrity and relations.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="update_name"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="update_name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="update_phone"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="update_phone"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Must be exactly 10 numeric digits.</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Course */}
                <div>
                  <label
                    htmlFor="update_course"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Course / Branch <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <select
                      id="update_course"
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
                </div>

                {/* Semester */}
                <div>
                  <label
                    htmlFor="update_semester"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Current Semester <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <select
                      id="update_semester"
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
                </div>

                {/* Modification diff preview */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block mb-1">
                    Current Saved Values:
                  </span>
                  <div className="text-slate-600">
                    <strong>Name:</strong> {currentStudent.name}
                  </div>
                  <div className="text-slate-600">
                    <strong>Branch:</strong> {currentStudent.course}
                  </div>
                  <div className="text-slate-600">
                    <strong>Semester:</strong> {currentStudent.semester}
                  </div>
                  <div className="text-slate-600">
                    <strong>Phone:</strong> {currentStudent.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Updated Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
