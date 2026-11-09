import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  TableProperties,
  Search,
  UserPen,
  UserX,
  Info,
  Database,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { ActivePage } from '../types/student';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  studentCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  studentCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'register',
      label: 'Register Student',
      icon: <UserPlus className="w-4 h-4" />,
    },
    {
      id: 'view_all',
      label: 'View All Students',
      icon: <TableProperties className="w-4 h-4" />,
      badge: String(studentCount),
    },
    {
      id: 'search',
      label: 'Search Student',
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: 'update',
      label: 'Update Student',
      icon: <UserPen className="w-4 h-4" />,
    },
    {
      id: 'delete',
      label: 'Delete Student',
      icon: <UserX className="w-4 h-4" />,
    },
    {
      id: 'about',
      label: 'About Project & Viva',
      icon: <Info className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
                EduTrack
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  SE IT
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Student Database Mgmt</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation Menu
          </div>
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Developer Credit & JSON storage badge */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Developer Details</span>
            </div>
            <div className="space-y-0.5 text-blue-800">
              <p>
                <span className="font-semibold text-slate-600">Name:</span> Soham Nitin Dalal
              </p>
              <p>
                <span className="font-semibold text-slate-600">Roll No:</span> 59
              </p>
              <p>
                <span className="font-semibold text-slate-600">Department:</span> SE IT
              </p>
              <p className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-blue-700">
                <Database className="w-3 h-3" />
                <span>JSON File Storage (Local)</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
