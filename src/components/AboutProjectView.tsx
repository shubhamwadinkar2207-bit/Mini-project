import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  Code2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldCheck,
  CheckCircle,
  Database,
  ExternalLink,
} from 'lucide-react';

export const AboutProjectView: React.FC = () => {
  // Accordion state for CS concepts
  const [openConcept, setOpenConcept] = useState<number | null>(0);

  // Accordion state for Viva questions
  const [openViva, setOpenViva] = useState<number | null>(0);

  const concepts = [
    {
      title: '1. Modular Functions & Separation of Concerns (CRUD)',
      content: [
        'Create: add_student() validates input, verifies primary key uniqueness, and appends the new record.',
        'Read: load_students() and search_students() retrieve records and perform structured queries and substring filters.',
        'Update: update_student() locates the record by primary key (Roll Number) and modifies mutable attributes.',
        'Delete: delete_student() removes the specified student record safely after explicit user confirmation.',
        'Keeping each operation strictly modular ensures the codebase remains maintainable, unit-testable, and clean.',
      ],
    },
    {
      title: '2. File Handling & JSON Persistence (json module / LocalStorage)',
      content: [
        'Serialization: Converts in-memory structured data (records / objects) into formatted JSON strings with indentation.',
        'Deserialization: Reads stored JSON strings and parses them back into typed objects.',
        'Persistence: Data survives application reloads and server restarts without requiring paid cloud database servers.',
      ],
    },
    {
      title: '3. Exception Handling & Robustness (try...except / Guard Clauses)',
      content: [
        'Gracefully handles missing storage files on initial boot without throwing fatal application errors.',
        'Catches JSON decoding errors when user-uploaded backup files are malformed.',
        'Prevents illegal states with strict input validation on roll numbers, names, and phone numbers.',
      ],
    },
    {
      title: '4. Input Validation & Primary Key Enforcement',
      content: [
        'Uniqueness Constraint: Prohibits duplicate roll numbers using case-insensitive matching.',
        'Name Sanity: Ensures full name has at least 2 characters consisting solely of alphabetic letters, spaces, and periods.',
        'Phone Number Format: Enforces exact 10 numeric digits conforming to standard mobile numbering plans.',
      ],
    },
  ];

  const vivaQuestions = [
    {
      q: 'Q1: Why did you choose JSON instead of MySQL for this mini project?',
      a: 'JSON is lightweight, human-readable, requires zero external database installation, and stores structured key-value data naturally. For a mini project, it eliminates connection overhead, username/password configurations, and external server dependencies while providing full data persistence across sessions.',
    },
    {
      q: 'Q2: What is Streamlit and how does it work?',
      a: 'Streamlit is an open-source Python framework used to create interactive web applications for data science and administrative tools. Whenever a user interacts with a widget (button, input, dropdown), Streamlit re-executes the script from top to bottom, updating the user interface seamlessly.',
    },
    {
      q: 'Q3: How do you prevent duplicate roll numbers in your application?',
      a: 'In the registration logic, we iterate over existing records and compare the input roll number case-insensitively against existing records. If any match is found, an error is returned and the record is rejected, ensuring the primary key uniqueness constraint is never violated.',
    },
    {
      q: 'Q4: How does the application handle missing or corrupted data files?',
      a: 'We use safe file existence checks and try...catch exception blocks. If the storage file does not exist or contains malformed JSON, the application gracefully returns an empty list or default seed dataset instead of crashing.',
    },
    {
      q: 'Q5: What is the significance of the Primary Key in database management?',
      a: 'A Primary Key (Roll Number in our case) uniquely identifies each record in the database. It cannot be null, cannot be duplicated, and is kept immutable during update operations to ensure reliable data retrieval and referential integrity.',
    },
    {
      q: 'Q6: What is JSON serialization vs deserialization?',
      a: 'Serialization is the process of converting in-memory data structures (like lists of dictionaries or objects) into a formatted JSON string (e.g., json.dump or JSON.stringify). Deserialization is the reverse process, parsing a JSON string back into usable memory objects (e.g., json.load or JSON.parse).',
    },
    {
      q: 'Q7: What are CRUD operations and why are they fundamental in software engineering?',
      a: 'CRUD stands for Create, Read, Update, and Delete. These four basic operations form the cornerstone of any relational or persistent information management system, covering the entire lifecycle of application data.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Profile & Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Developer Card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Student Developer Details</h3>
            <p className="text-xs text-slate-500 mb-4">
              Academic Project & Examination Viva Voce
            </p>

            <div className="space-y-3 text-sm divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900">Soham Nitin Dalal</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Roll Number:</span>
                <span className="font-bold text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  59
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="font-semibold text-slate-800">Second Year IT (SE IT)</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Course:</span>
                <span className="font-semibold text-slate-800">Python Mini Project</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Academic Year:</span>
                <span className="font-semibold text-slate-800">2026</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Technology Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                Python 3
              </span>
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                Streamlit / React
              </span>
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                JSON File Storage
              </span>
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                Pandas & TypeScript
              </span>
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        {/* Project Objectives & Architecture */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Project Objectives & Overview</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              The <strong>Student Database Management System</strong> is a lightweight, responsive
              web application designed for educational institutions to perform full <strong>CRUD</strong>{' '}
              (Create, Read, Update, Delete) operations on student records with robust input validation
              and data persistence.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Why JSON Flat File Storage?</span>
              </div>
              <p className="leading-relaxed">
                Unlike complex enterprise systems that require heavy database servers (like MySQL, PostgreSQL,
                or Oracle), this application leverages <strong>JSON-based structured file storage</strong>.
                This makes the project lightweight, fast, cross-platform, zero-configuration, and ideal for
                academic demonstrations and college viva examinations.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-blue-700 block">Create</span>
              <span className="text-[11px] text-slate-500">Student Entry</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-blue-700 block">Read</span>
              <span className="text-[11px] text-slate-500">Query & Filter</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-blue-700 block">Update</span>
              <span className="text-[11px] text-slate-500">Modify Data</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-blue-700 block">Delete</span>
              <span className="text-[11px] text-slate-500">Safe Removal</span>
            </div>
          </div>
        </div>
      </div>

      {/* CS Concepts Implemented */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <Code2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Python & Computer Science Concepts Implemented
          </h3>
        </div>

        <div className="space-y-3">
          {concepts.map((c, idx) => {
            const isOpen = openConcept === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenConcept(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100 text-left font-semibold text-sm text-slate-800 transition-colors cursor-pointer"
                >
                  <span>{c.title}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100">
                    <ul className="list-disc pl-5 space-y-1.5">
                      {c.content.map((point, pIdx) => (
                        <li key={pIdx} className="leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* College Viva Voce Questions & Answers */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              College Viva Voce Questions & Answers (Interactive Guide)
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {vivaQuestions.length} Questions
          </span>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openViva === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenViva(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-blue-50/40 text-left font-bold text-xs sm:text-sm text-slate-800 transition-colors cursor-pointer"
                >
                  <span className="text-blue-900">{item.q}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-blue-600">
                      {isOpen ? 'Hide Answer' : 'Reveal Answer'}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 bg-blue-50/30 text-xs sm:text-sm text-slate-700 border-t border-slate-200 space-y-2">
                    <p className="leading-relaxed">
                      <strong className="text-blue-900">Answer: </strong>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
