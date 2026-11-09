import React from 'react';
import { Download, Database, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderBannerProps {
  title: string;
  subtitle: string;
  studentCount: number;
  onOpenDbModal: () => void;
  onResetData: () => void;
  onExportJSON: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title,
  subtitle,
  studentCount,
  onOpenDbModal,
  onResetData,
  onExportJSON,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 p-6 text-white shadow-lg shadow-blue-900/10 mb-6">
      {/* Decorative background circle */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-blue-500/10 pointer-events-none blur-xl" />
      <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-white/5 pointer-events-none blur-lg" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl" role="img" aria-label="graduation cap">
              🎓
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-700/60 text-blue-200 border border-blue-400/30">
              EduTrack • Academic DB
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {studentCount} {studentCount === 1 ? 'Student' : 'Students'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-blue-100/90 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={onExportJSON}
            title="Download students.json"
            aria-label="Download students.json"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors backdrop-blur-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>students.json</span>
          </button>

          <button
            onClick={onOpenDbModal}
            title="Manage Database JSON"
            aria-label="Manage Database JSON"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors backdrop-blur-xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Import / Backup</span>
          </button>

          {studentCount > 0 && (
            <button
              onClick={onResetData}
              title="Clear Database"
              aria-label="Clear Database"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors backdrop-blur-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear DB</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
