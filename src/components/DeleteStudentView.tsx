import React, { useState, useEffect } from 'react';
import {
  UserX,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  Phone,
  User,
  ShieldAlert,
} from 'lucide-react';
import { Student, ActivePage } from '../types/student';

interface DeleteStudentViewProps {
  students: Student[];
  initialSelectedRoll?: string;
  onDeleteStudent: (rollNo: string) => { success: boolean; message: string };
  onNavigate: (page: ActivePage) => void;
}

export const DeleteStudentView: React.FC<DeleteStudentViewProps> = ({
  students,
  initialSelectedRoll,
  onDeleteStudent,
  onNavigate,
}) => {
  const [selectedRoll, setSelectedRoll] = useState<string>(
    initialSelectedRoll || (students.length > 0 ? students[0].roll_no : '')
  );
  const [confirmed, setConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (initialSelectedRoll && students.some((s) => s.roll_no === initialSelectedRoll)) {
      setSelectedRoll(initialSelectedRoll);
    } else if (students.length > 0 && !students.some((s) => s.roll_no === selectedRoll)) {
      setSelectedRoll(students[0].roll_no);
    }
    setConfirmed(false);
  }, [initialSelectedRoll, students]);

  const target = students.find((s) => s.roll_no === selectedRoll);

  const handleDelete = () => {
    if (!confirmed || !selectedRoll) return;

    const res = onDeleteStudent(selectedRoll);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message,
      });
      setConfirmed(false);
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <UserX className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-base">No Student Records Found</h4>
        <p className="text-sm text-slate-500">
          There are currently no students in the database to delete.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          Register New Student
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Feedback banner */}
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
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <h4 className="font-bold text-sm">
              {statusMessage.type === 'success' ? 'Record Deleted' : 'Deletion Error'}
            </h4>
            <p className="text-sm mt-0.5">{statusMessage.text}</p>
          </div>

          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selector Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <label
          htmlFor="select_student_delete"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Select Student to Delete:
        </label>
        <div className="relative">
          <select
            id="select_student_delete"
            value={selectedRoll}
            onChange={(e) => {
              setSelectedRoll(e.target.value);
              setConfirmed(false);
              setStatusMessage(null);
            }}
            className="w-full text-sm font-semibold py-2.5 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.roll_no} value={s.roll_no}>
                {s.roll_no} - {s.name} ({s.course}, {s.semester})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Preview Card (Faithfully matching Streamlit red-accented student card) */}
      {target && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 border-l-4 border-l-rose-600 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Roll No: {target.roll_no}
              </span>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Target Record
              </span>
            </div>

            <div className="mt-2.5 font-bold text-lg text-rose-900 flex items-center gap-2">
              <User className="w-5 h-5 text-rose-700" />
              <span>{target.name}</span>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Course:</strong> {target.course}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Semester:</strong> {target.semester}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-xs">
                  <strong>Phone:</strong> {target.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-bold text-amber-900 text-sm">
                Permanent Action Warning
              </p>
              <p>
                Deleting this record will permanently remove <strong>{target.name}</strong> (Roll No: {target.roll_no}) from the database. This action cannot be reversed.
              </p>
            </div>
          </div>

          {/* Safety Confirmation Checkbox */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-800 leading-snug">
                I confirm that I want to delete this student record permanently.
              </span>
            </label>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={!confirmed}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-sm transition-all ${
                  confirmed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-rose-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Student Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
