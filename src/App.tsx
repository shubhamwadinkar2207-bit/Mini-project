/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Student, ActivePage } from './types/student';
import {
  INITIAL_STUDENTS,
  addStudentLogic,
  updateStudentLogic,
  deleteStudentLogic,
  exportToCSV,
  exportToJSON,
} from './utils/studentLogic';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RegisterStudentView } from './components/RegisterStudentView';
import { ViewAllStudentsView } from './components/ViewAllStudentsView';
import { SearchStudentView } from './components/SearchStudentView';
import { UpdateStudentView } from './components/UpdateStudentView';
import { DeleteStudentView } from './components/DeleteStudentView';
import { AboutProjectView } from './components/AboutProjectView';
import { DatabaseModal } from './components/DatabaseModal';

const STORAGE_KEY = 'edu_track_students_database_clean';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback on corrupt storage
    }
    return INITIAL_STUDENTS;
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [editTargetRoll, setEditTargetRoll] = useState<string>('');
  const [deleteTargetRoll, setDeleteTargetRoll] = useState<string>('');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (err) {
      console.error('Failed to sync students to localStorage:', err);
    }
  }, [students]);

  // CRUD Operations Handlers
  const handleAddStudent = (newStudent: Omit<Student, 'createdAt'>) => {
    const { updatedList, result } = addStudentLogic(students, newStudent);
    if (result.success) {
      setStudents(updatedList);
    }
    return result;
  };

  const handleUpdateStudent = (
    rollNo: string,
    updatedFields: { name: string; course: string; semester: string; phone: string }
  ) => {
    const { updatedList, result } = updateStudentLogic(students, rollNo, updatedFields);
    if (result.success) {
      setStudents(updatedList);
    }
    return result;
  };

  const handleDeleteStudent = (rollNo: string) => {
    const { updatedList, result } = deleteStudentLogic(students, rollNo);
    if (result.success) {
      setStudents(updatedList);
    }
    return result;
  };

  const handleSelectForEdit = (rollNo: string) => {
    setEditTargetRoll(rollNo);
    setActivePage('update');
  };

  const handleSelectForDelete = (rollNo: string) => {
    setDeleteTargetRoll(rollNo);
    setActivePage('delete');
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(students);
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

  const handleExportJSON = () => {
    const jsonStr = exportToJSON(students);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportStudents = (importedStudents: Student[]) => {
    setStudents(importedStudents);
  };

  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
  };

  // Header banner titles & subtitles matching the Python Streamlit application
  const pageMeta: Record<ActivePage, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Student Database Dashboard',
      subtitle:
        'Overview of registered students, department statistics, and recent enrollments',
    },
    register: {
      title: 'Register New Student',
      subtitle:
        'Fill in the form details below to add a new student record to the JSON database',
    },
    view_all: {
      title: 'All Student Records',
      subtitle:
        'View, filter, sort, and export the complete directory of registered students',
    },
    search: {
      title: 'Search Student Records',
      subtitle:
        'Quickly locate any student by typing their Roll Number or Full Name',
    },
    update: {
      title: 'Update Student Details',
      subtitle:
        'Select a student by Roll Number to edit their details and save changes',
    },
    delete: {
      title: 'Delete Student Record',
      subtitle:
        'Permanently remove a student record with explicit safety confirmation',
    },
    about: {
      title: 'About the Project & Viva Guide',
      subtitle:
        'Comprehensive documentation of project architecture, Python concepts, and viva voce notes',
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col antialiased">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">EduTrack</h1>
            <span className="text-[10px] text-slate-500 font-medium">Student Database Mgmt</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onSelectPage={setActivePage}
          studentCount={students.length}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <HeaderBanner
            title={pageMeta[activePage].title}
            subtitle={pageMeta[activePage].subtitle}
            studentCount={students.length}
            onOpenDbModal={() => setIsDbModalOpen(true)}
            onResetData={handleResetData}
            onExportJSON={handleExportJSON}
          />

          {/* Page Routing */}
          <section className="transition-all">
            {activePage === 'dashboard' && (
              <DashboardView
                students={students}
                onNavigate={setActivePage}
                onExportCSV={handleExportCSV}
              />
            )}

            {activePage === 'register' && (
              <RegisterStudentView
                onAddStudent={handleAddStudent}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'view_all' && (
              <ViewAllStudentsView
                students={students}
                onNavigate={setActivePage}
                onSelectForEdit={handleSelectForEdit}
                onSelectForDelete={handleSelectForDelete}
                onExportJSON={handleExportJSON}
              />
            )}

            {activePage === 'search' && (
              <SearchStudentView
                students={students}
                onNavigate={setActivePage}
                onSelectForEdit={handleSelectForEdit}
                onSelectForDelete={handleSelectForDelete}
              />
            )}

            {activePage === 'update' && (
              <UpdateStudentView
                students={students}
                initialSelectedRoll={editTargetRoll}
                onUpdateStudent={handleUpdateStudent}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'delete' && (
              <DeleteStudentView
                students={students}
                initialSelectedRoll={deleteTargetRoll}
                onDeleteStudent={handleDeleteStudent}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'about' && <AboutProjectView />}
          </section>
        </main>
      </div>

      {/* JSON Database Import/Export Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        students={students}
        onImportStudents={handleImportStudents}
        onResetData={handleResetData}
      />
    </div>
  );
}
