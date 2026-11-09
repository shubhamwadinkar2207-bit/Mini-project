import React, { useState, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import { Student } from '../types/student';
import { exportToJSON, parseImportJSON } from '../utils/studentLogic';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onImportStudents: (imported: Student[]) => void;
  onResetData: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  students,
  onImportStudents,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'import'>('view');
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const jsonContent = exportToJSON(students);

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!importText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste or select a JSON file to import.' });
      return;
    }

    const res = parseImportJSON(importText);
    if (res.success && res.data) {
      onImportStudents(res.data);
      setStatusMessage({
        type: 'success',
        text: `Successfully imported ${res.data.length} student records into database!`,
      });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1500);
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Invalid JSON format or validation failed.',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal_title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal_title" className="text-base font-bold text-slate-900">
                JSON Database Management
              </h3>
              <p className="text-xs text-slate-500">
                Export, backup, or import <code className="font-mono text-blue-600">students.json</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('view');
              setStatusMessage(null);
            }}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'view'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Current Database ({students.length} Records)
          </button>
          <button
            onClick={() => {
              setActiveTab('import');
              setStatusMessage(null);
            }}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Import JSON File
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mx-5 mt-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'view' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Formatted JSON Representation:</span>
                <span className="font-mono">{new Blob([jsonContent]).size} bytes</span>
              </div>
              <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
                {jsonContent}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors text-center bg-slate-50/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Select a <code className="font-mono text-blue-600">students.json</code> file
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  or paste the raw JSON text below
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    Choose Local File
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="import_json_textarea"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Or Paste JSON Text:
                </label>
                <textarea
                  id="import_json_textarea"
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='[ { "roll_no": "59", "name": "Soham Dalal", "course": "Information Technology", "semester": "Semester 4", "phone": "9876543210" } ]'
                  className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {students.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setStatusMessage({ type: 'success', text: 'All records cleared from database!' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Records</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'view' ? (
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download students.json</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProcessImport}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Validate & Import Records</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
