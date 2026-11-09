export interface Student {
  roll_no: string;
  name: string;
  course: string;
  semester: string;
  phone: string;
  createdAt?: string;
}

export type CourseType =
  | 'Information Technology'
  | 'Computer Engineering'
  | 'AI & Data Science'
  | 'Electronics & Telecommunication'
  | 'Mechanical Engineering'
  | 'Civil Engineering';

export type SemesterType =
  | 'Semester 1'
  | 'Semester 2'
  | 'Semester 3'
  | 'Semester 4'
  | 'Semester 5'
  | 'Semester 6'
  | 'Semester 7'
  | 'Semester 8';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface CRUDResult {
  success: boolean;
  message: string;
}

export type ActivePage =
  | 'dashboard'
  | 'register'
  | 'view_all'
  | 'search'
  | 'update'
  | 'delete'
  | 'about';
