import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateInputs,
  addStudentLogic,
  updateStudentLogic,
  deleteStudentLogic,
  searchStudentsLogic,
  filterStudentsLogic,
  exportToCSV,
  exportToJSON,
  parseImportJSON,
} from './studentLogic';
import { Student } from '../types/student';

// Sample test fixtures for unit tests
const TEST_FIXTURE_STUDENTS: Student[] = [
  {
    roll_no: '59',
    name: 'Soham Nitin Dalal',
    course: 'Information Technology',
    semester: 'Semester 4',
    phone: '9876543210',
  },
  {
    roll_no: '12',
    name: 'Ananya Sharma',
    course: 'Computer Engineering',
    semester: 'Semester 4',
    phone: '9823456789',
  },
  {
    roll_no: '71',
    name: 'Sneha More',
    course: 'Information Technology',
    semester: 'Semester 4',
    phone: '9855667788',
  },
];

test('validateInputs correctly verifies valid input', () => {
  const result = validateInputs('59', 'Soham Nitin Dalal', '9876543210');
  assert.equal(result.isValid, true);
  assert.equal(result.message, '');
});

test('validateInputs rejects empty roll number', () => {
  const result = validateInputs('', 'Soham Dalal', '9876543210');
  assert.equal(result.isValid, false);
  assert.match(result.message, /Roll Number cannot be empty/);
});

test('validateInputs rejects short name or invalid characters', () => {
  const shortName = validateInputs('101', 'A', '9876543210');
  assert.equal(shortName.isValid, false);
  assert.match(shortName.message, /at least 2 characters/);

  const numericName = validateInputs('101', 'Soham123', '9876543210');
  assert.equal(numericName.isValid, false);
  assert.match(numericName.message, /contain only letters and spaces/);
});

test('validateInputs rejects invalid phone numbers', () => {
  const nineDigits = validateInputs('101', 'Soham Dalal', '987654321');
  assert.equal(nineDigits.isValid, false);
  assert.match(nineDigits.message, /exactly 10 digits/);

  const alphaPhone = validateInputs('101', 'Soham Dalal', '98765abcde');
  assert.equal(alphaPhone.isValid, false);
  assert.match(alphaPhone.message, /exactly 10 digits/);
});

test('addStudentLogic successfully registers new student', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];
  const newStudent = {
    roll_no: '99',
    name: 'Priya Sharma',
    course: 'Computer Engineering',
    semester: 'Semester 4',
    phone: '9123456780',
  };

  const { updatedList, result } = addStudentLogic(mockStudents, newStudent);
  assert.equal(result.success, true);
  assert.equal(updatedList.length, mockStudents.length + 1);
  assert.equal(updatedList[updatedList.length - 1].roll_no, '99');
  assert.equal(updatedList[updatedList.length - 1].name, 'Priya Sharma');
});

test('addStudentLogic rejects duplicate roll numbers (case-insensitive)', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];
  const duplicateStudent = {
    roll_no: '59', // already exists in TEST_FIXTURE_STUDENTS
    name: 'Duplicate Student',
    course: 'Information Technology',
    semester: 'Semester 1',
    phone: '9876543210',
  };

  const { updatedList, result } = addStudentLogic(mockStudents, duplicateStudent);
  assert.equal(result.success, false);
  assert.match(result.message, /already exists/);
  assert.equal(updatedList.length, mockStudents.length);
});

test('updateStudentLogic successfully updates student details', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];
  const { updatedList, result } = updateStudentLogic(mockStudents, '59', {
    name: 'Soham N. Dalal',
    course: 'Information Technology',
    semester: 'Semester 5',
    phone: '9998887776',
  });

  assert.equal(result.success, true);
  const updatedStudent = updatedList.find((s) => s.roll_no === '59');
  assert.ok(updatedStudent);
  assert.equal(updatedStudent.name, 'Soham N. Dalal');
  assert.equal(updatedStudent.semester, 'Semester 5');
  assert.equal(updatedStudent.phone, '9998887776');
});

test('deleteStudentLogic deletes record by roll number', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];
  const targetRoll = '12';
  const { updatedList, result } = deleteStudentLogic(mockStudents, targetRoll);

  assert.equal(result.success, true);
  assert.equal(updatedList.length, mockStudents.length - 1);
  assert.equal(updatedList.some((s) => s.roll_no === targetRoll), false);
});

test('deleteStudentLogic returns error if roll number not found', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];
  const { updatedList, result } = deleteStudentLogic(mockStudents, 'NON_EXISTENT_ROLL');

  assert.equal(result.success, false);
  assert.equal(updatedList.length, mockStudents.length);
  assert.match(result.message, /was not found/);
});

test('searchStudentsLogic filters by roll number or name case-insensitively', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];

  // Search by roll number
  const byRoll = searchStudentsLogic(mockStudents, '59');
  assert.equal(byRoll.length, 1);
  assert.equal(byRoll[0].name, 'Soham Nitin Dalal');

  // Search by name partial
  const byName = searchStudentsLogic(mockStudents, 'sharma');
  assert.equal(byName.length, 1);
  assert.equal(byName[0].roll_no, '12');

  // Empty query returns all
  const all = searchStudentsLogic(mockStudents, '');
  assert.equal(all.length, mockStudents.length);
});

test('filterStudentsLogic filters by course and semester correctly', () => {
  const mockStudents: Student[] = [...TEST_FIXTURE_STUDENTS];

  const itStudents = filterStudentsLogic(mockStudents, 'Information Technology', 'All Semesters');
  assert.equal(itStudents.length, 2);
  assert.ok(itStudents.every((s) => s.course === 'Information Technology'));

  const sem4Students = filterStudentsLogic(mockStudents, 'All Courses', 'Semester 4');
  assert.equal(sem4Students.length, 3);
});

test('exportToCSV and exportToJSON create valid format output', () => {
  const mockStudents = TEST_FIXTURE_STUDENTS.slice(0, 2);
  const csv = exportToCSV(mockStudents);
  assert.ok(csv.includes('Roll Number,Full Name,Course,Semester,Phone Number'));
  assert.ok(csv.includes('"Soham Nitin Dalal"'));

  const jsonStr = exportToJSON(mockStudents);
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].roll_no, '59');
});

test('parseImportJSON validates imported JSON data', () => {
  const validJson = JSON.stringify([
    {
      roll_no: '201',
      name: 'Karan Mehra',
      course: 'AI & Data Science',
      semester: 'Semester 3',
      phone: '9812345678',
    },
  ]);

  const result = parseImportJSON(validJson);
  assert.equal(result.success, true);
  assert.equal(result.data?.length, 1);
  assert.equal(result.data?.[0].roll_no, '201');

  // Rejects invalid JSON structure
  const invalidResult = parseImportJSON('{"single": "object"}');
  assert.equal(invalidResult.success, false);
});
