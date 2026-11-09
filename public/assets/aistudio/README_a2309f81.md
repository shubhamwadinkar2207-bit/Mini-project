# 🎓 Student Database Management System

A modern, responsive, and beginner-friendly web-based **Student Database Management System** developed in **Python 3** using **Streamlit** and **JSON file storage**.

---

## 👨‍🎓 Project & Student Information

- **Student Name:** Soham Nitin Dalal
- **Roll Number:** 59
- **Department:** Second Year Information Technology (SE IT)
- **Course:** Python Mini Project
- **Academic Year:** 2026

---

## 🚀 Key Features

1. **Clean White & Blue UI:** Professional, clutter-free academic theme designed with CSS accents and responsive Streamlit components.
2. **Interactive Dashboard:** Real-time summary metrics showing total students, branches, semesters, and interactive distribution charts.
3. **Student Registration (Create):** Clean form to register students with Roll Number, Full Name, Course, Semester, and Phone Number.
4. **Duplicate Prevention:** Enforces primary key uniqueness by prohibiting duplicate roll numbers.
5. **View All Students (Read):** Displays records in a formatted data table with filtering by Course/Semester and one-click CSV export.
6. **Search System:** Instant case-insensitive search by Roll Number or Student Name with structured profile cards.
7. **Student Record Update (Update):** Allows selecting any existing student to edit their details safely without altering their primary key.
8. **Safe Deletion (Delete):** Removal workflow requiring explicit checkbox confirmation to prevent accidental loss of data.
9. **Persistent JSON Storage:** Saves all records to a local `students.json` file, persisting records across server restarts without requiring any paid or external SQL database.
10. **Exception Handling & Validation:** Safe against missing/empty files, bad inputs, and invalid phone numbers.
11. **Mobile-Friendly:** Responsive layout adapting across desktops, laptops, tablets, and mobile browsers.
12. **Viva Voce Ready:** Built-in "About Project" section containing code explanations and college viva preparation questions.

---

## 🛠️ Technology Stack

| Component | Technology Used | Purpose |
| :--- | :--- | :--- |
| **Language** | Python 3 | Core application logic and validation |
| **Frontend & UI** | Streamlit | Responsive web interface & forms |
| **Data Storage** | JSON (`students.json`) | Lightweight, zero-config data persistence |
| **Data Processing** | Pandas | Tabular data representation & CSV export |

---

## 📁 Project Structure

```text
python Mini_project/
├── .streamlit/
│   └── config.toml       # Custom blue & white theme configuration
├── app.py                # Main Streamlit web application & CRUD logic
├── students.json         # JSON database storing student records
├── requirements.txt      # Project dependencies
├── .gitignore            # Files ignored by Git
└── README.md             # Project documentation & viva guide
```

---

## 💻 Installation & Setup Guide

### Step 1: Open Terminal / Command Prompt
Navigate to the project directory:
```bash
cd "e:\python Mini_project"
```

### Step 2: Install Required Dependencies
Run the following command to install Streamlit and Pandas:
```bash
pip install -r requirements.txt
```
*(or `python -m pip install -r requirements.txt`)*

### Step 3: Run the Application
Start the Streamlit web server:
```bash
streamlit run app.py
```
*(or `python -m streamlit run app.py`)*

### Step 4: Open in Your Browser
The app will automatically launch in your default web browser at:
```text
http://localhost:8501
```

---

## 📖 Code Walkthrough & Viva Explanation

### 1. File Handling (`load_students` and `save_students`)
- **`load_students()`**: Uses Python's built-in `json.load()` inside a `try...except` block. If `students.json` does not exist or contains invalid formatting, it gracefully returns an empty list `[]` instead of crashing.
- **`save_students()`**: Uses `json.dump(..., indent=4)` to write formatted JSON data back to disk so student records persist permanently.

### 2. CRUD Operations
- **Create (`add_student`)**: Validates that all fields are filled, checks that the roll number doesn't already exist, and appends a new dictionary to the list.
- **Read (`load_students`, `search_students`)**: Reads records and filters based on user queries or dropdown filters.
- **Update (`update_student`)**: Finds the matching roll number, updates the name, course, semester, and phone number, and saves the file.
- **Delete (`delete_student`)**: Uses Python list comprehension to filter out the selected student record and saves the updated list.

### 3. Input Validation
- **Roll Number:** Non-empty string, checked for duplicates.
- **Full Name:** Minimum 2 characters, strictly alphabet characters and spaces.
- **Phone Number:** Exactly 10 digits (`^\d{10}$`).

---

## 🎯 Frequently Asked Viva Questions (FAQ)

### Q1: Why did you use JSON instead of SQLite or MySQL?
> **Answer:** JSON is a lightweight, human-readable data format supported natively by Python without requiring any database driver, server setup, or user credentials. It is ideal for mini-projects, portable across operating systems, and meets all college project requirements.

### Q2: What is Streamlit and how does its execution model work?
> **Answer:** Streamlit is an open-source Python framework for building web applications. Its unique model re-executes the script from top to bottom whenever an input widget (button, text input, selectbox) changes state, making the code simple and linear.

### Q3: How do you prevent duplicate primary keys (Roll Numbers)?
> **Answer:** In `add_student()`, we loop through the existing list of student dictionaries and compare `s['roll_no'].lower() == roll_clean.lower()`. If matched, registration is halted and an error message is returned.

### Q4: How is data safety maintained during delete operations?
> **Answer:** Accidental deletions are prevented by showing the student's profile details first and requiring the user to explicitly check a confirmation checkbox before the delete action is executed.

---

## 📜 License
This project is developed for educational purposes as part of the Second Year Information Technology curriculum.

