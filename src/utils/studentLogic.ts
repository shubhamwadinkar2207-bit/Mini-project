import { Student, ValidationResult, CRUDResult } from '../types/student';

export const COURSES_LIST: string[] = [
  'Information Technology',
  'Computer Engineering',
  'AI & Data Science',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const SEMESTER_LIST: string[] = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

// Empty initial students database - ready for fresh student registrations
export const INITIAL_STUDENTS: Student[] = [];

/**
 * Validates student input according to system rules:
 * - Roll Number: non-empty
 * - Name: at least 2 chars, letters and spaces and periods only
 * - Phone: exactly 10 digits
 */
export function validateInputs(
  roll_no: string | undefined | null,
  name: string | undefined | null,
  phone: string | undefined | null
): ValidationResult {
  const rollClean = (roll_no ?? '').trim();
  const nameClean = (name ?? '').trim();
  const phoneClean = (phone ?? '').trim();

  if (!rollClean) {
    return { isValid: false, message: 'Roll Number cannot be empty.' };
  }

  if (!nameClean || nameClean.length < 2) {
    return { isValid: false, message: 'Student Name must be at least 2 characters long.' };
  }

  // Name should contain only letters, spaces, and periods
  if (!/^[A-Za-z\s.]+$/.test(nameClean)) {
    return { isValid: false, message: 'Student Name should contain only letters and spaces.' };
  }

  // Exactly 10 numeric digits
  if (!/^\d{10}$/.test(phoneClean)) {
    return { isValid: false, message: 'Phone Number must be exactly 10 digits (e.g., 9876543210).' };
  }

  return { isValid: true, message: '' };
}

/**
 * Adds a new student record after validation and uniqueness check.
 */
export function addStudentLogic(
  currentStudents: Student[],
  newStudent: Omit<Student, 'createdAt'>
): { updatedList: Student[]; result: CRUDResult } {
  const rollClean = newStudent.roll_no.trim();
  const nameClean = newStudent.name.trim();
  const phoneClean = newStudent.phone.trim();

  const validation = validateInputs(rollClean, nameClean, phoneClean);
  if (!validation.isValid) {
    return { updatedList: currentStudents, result: { success: false, message: validation.message } };
  }

  // Check for duplicate roll number (case-insensitive)
  const isDuplicate = currentStudents.some(
    (s) => s.roll_no.trim().toLowerCase() === rollClean.toLowerCase()
  );
  if (isDuplicate) {
    return {
      updatedList: currentStudents,
      result: {
        success: false,
        message: `A student with Roll Number '${rollClean}' already exists!`,
      },
    };
  }

  const record: Student = {
    roll_no: rollClean,
    name: nameClean,
    course: newStudent.course,
    semester: newStudent.semester,
    phone: phoneClean,
    createdAt: new Date().toISOString(),
  };

  const updatedList = [...currentStudents, record];
  return {
    updatedList,
    result: {
      success: true,
      message: `Student '${nameClean}' (Roll No: ${rollClean}) successfully registered!`,
    },
  };
}

/**
 * Updates an existing student record by primary key (roll number).
 */
export function updateStudentLogic(
  currentStudents: Student[],
  roll_no: string,
  updatedFields: { name: string; course: string; semester: string; phone: string }
): { updatedList: Student[]; result: CRUDResult } {
  const rollClean = roll_no.trim();
  const nameClean = updatedFields.name.trim();
  const phoneClean = updatedFields.phone.trim();

  const validation = validateInputs(rollClean, nameClean, phoneClean);
  if (!validation.isValid) {
    return { updatedList: currentStudents, result: { success: false, message: validation.message } };
  }

  let found = false;
  const updatedList = currentStudents.map((s) => {
    if (s.roll_no.trim().toLowerCase() === rollClean.toLowerCase()) {
      found = true;
      return {
        ...s,
        name: nameClean,
        course: updatedFields.course,
        semester: updatedFields.semester,
        phone: phoneClean,
      };
    }
    return s;
  });

  if (!found) {
    return {
      updatedList: currentStudents,
      result: { success: false, message: `Student with Roll Number '${rollClean}' was not found.` },
    };
  }

  return {
    updatedList,
    result: {
      success: true,
      message: `Details for Roll Number '${rollClean}' updated successfully!`,
    },
  };
}

/**
 * Deletes a student record by roll number.
 */
export function deleteStudentLogic(
  currentStudents: Student[],
  roll_no: string
): { updatedList: Student[]; result: CRUDResult } {
  const rollClean = roll_no.trim().toLowerCase();
  const initialCount = currentStudents.length;
  const updatedList = currentStudents.filter((s) => s.roll_no.trim().toLowerCase() !== rollClean);

  if (updatedList.length === initialCount) {
    return {
      updatedList: currentStudents,
      result: { success: false, message: `Student with Roll Number '${roll_no}' was not found.` },
    };
  }

  return {
    updatedList,
    result: {
      success: true,
      message: `Student with Roll Number '${roll_no}' deleted successfully!`,
    },
  };
}

/**
 * Search students by roll number or name (case-insensitive substring match).
 */
export function searchStudentsLogic(students: Student[], query: string): Student[] {
  const q = query.trim().toLowerCase();
  if (!q) return students;
  return students.filter(
    (s) => s.roll_no.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  );
}

/**
 * Filter students by course and semester.
 */
export function filterStudentsLogic(
  students: Student[],
  courseFilter: string,
  semesterFilter: string
): Student[] {
  return students.filter((s) => {
    const courseMatches = !courseFilter || courseFilter === 'All Courses' || s.course === courseFilter;
    const semMatches = !semesterFilter || semesterFilter === 'All Semesters' || s.semester === semesterFilter;
    return courseMatches && semMatches;
  });
}

/**
 * Exports students list to CSV format.
 */
export function exportToCSV(students: Student[]): string {
  const headers = ['Roll Number', 'Full Name', 'Course', 'Semester', 'Phone Number'];
  const rows = students.map((s) => [
    `"${s.roll_no.replace(/"/g, '""')}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.course.replace(/"/g, '""')}"`,
    `"${s.semester.replace(/"/g, '""')}"`,
    `"${s.phone.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Formats students list to pretty JSON string with 4-space indentation matching Python json.dump(..., indent=4).
 */
export function exportToJSON(students: Student[]): string {
  const cleanList = students.map(({ roll_no, name, course, semester, phone }) => ({
    roll_no,
    name,
    course,
    semester,
    phone,
  }));
  return JSON.stringify(cleanList, null, 4);
}

/**
 * Parses and validates an uploaded/imported JSON string.
 */
export function parseImportJSON(jsonText: string): { success: boolean; data?: Student[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'JSON content must be an array of student objects.' };
    }

    const validatedStudents: Student[] = [];
    const rollSet = new Set<string>();

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (typeof item !== 'object' || item === null) {
        return { success: false, error: `Item at index ${i} is not a valid object.` };
      }

      const roll_no = String(item.roll_no ?? '').trim();
      const name = String(item.name ?? '').trim();
      const course = String(item.course ?? '').trim() || COURSES_LIST[0];
      const semester = String(item.semester ?? '').trim() || SEMESTER_LIST[0];
      const phone = String(item.phone ?? '').trim();

      const validation = validateInputs(roll_no, name, phone);
      if (!validation.isValid) {
        return { success: false, error: `Record #${i + 1} (${name || 'Unnamed'}): ${validation.message}` };
      }

      if (rollSet.has(roll_no.toLowerCase())) {
        return { success: false, error: `Duplicate Roll Number '${roll_no}' found in JSON file.` };
      }
      rollSet.add(roll_no.toLowerCase());

      validatedStudents.push({
        roll_no,
        name,
        course,
        semester,
        phone,
        createdAt: item.createdAt || new Date().toISOString(),
      });
    }

    return { success: true, data: validatedStudents };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Failed to parse JSON file: ${errMsg}` };
  }
}
