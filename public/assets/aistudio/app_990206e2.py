"""
=================================================================================
Student Database Management System
---------------------------------------------------------------------------------
Student Name   : Soham Nitin Dalal
Roll Number    : 59
Department     : Second Year Information Technology (SE IT)
Technology     : Python 3, Streamlit, JSON File Storage
Description    : A modern, responsive, and beginner-friendly web application to
                 perform CRUD (Create, Read, Update, Delete) operations on student
                 records with JSON persistence and input validation.
=================================================================================
"""

import json
import os
import re
import pandas as pd
import streamlit as st

# ==============================================================================
# 1. APPLICATION CONFIGURATION & STYLING
# ==============================================================================
st.set_page_config(
    page_title="Student Database Management System",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for a professional White and Blue theme
CUSTOM_CSS = """
<style>
    /* Global styling */
    .main {
        background-color: #F8FAFC;
    }
    
    /* Main header banner */
    .banner-container {
        background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
        padding: 24px 30px;
        border-radius: 12px;
        color: white;
        margin-bottom: 25px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }
    .banner-title {
        font-size: 28px;
        font-weight: 700;
        margin: 0;
        color: #FFFFFF !important;
    }
    .banner-subtitle {
        font-size: 15px;
        color: #DBEAFE !important;
        margin-top: 6px;
    }
    
    /* Metric cards */
    .metric-card {
        background-color: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-left: 5px solid #2563EB;
        border-radius: 10px;
        padding: 18px 22px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        margin-bottom: 15px;
    }
    .metric-title {
        font-size: 13px;
        font-weight: 600;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .metric-value {
        font-size: 30px;
        font-weight: 700;
        color: #1E3A8A;
        margin-top: 4px;
    }
    
    /* Student profile display cards */
    .student-card {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 18px 20px;
        margin-bottom: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        transition: transform 0.15s ease-in-out;
    }
    .student-card:hover {
        border-color: #93C5FD;
        transform: translateY(-2px);
    }
    .badge-roll {
        background-color: #EFF6FF;
        color: #1D4ED8;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 13px;
        display: inline-block;
        border: 1px solid #BFDBFE;
    }
    .student-name {
        font-size: 18px;
        font-weight: 700;
        color: #0F172A;
        margin-top: 6px;
    }
    .student-detail {
        font-size: 14px;
        color: #475569;
        margin: 3px 0;
    }
    
    /* Sidebar developer credit */
    .dev-badge {
        background: #EFF6FF;
        border: 1px solid #BFDBFE;
        border-radius: 8px;
        padding: 12px;
        font-size: 12px;
        color: #1E40AF;
        margin-top: 20px;
    }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# Path to the JSON data storage file
DATA_FILE = "students.json"

# Standard list of engineering/college courses and semesters
COURSES_LIST = [
    "Information Technology",
    "Computer Engineering",
    "AI & Data Science",
    "Electronics & Telecommunication",
    "Mechanical Engineering",
    "Civil Engineering",
]

SEMESTER_LIST = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
]

# ==============================================================================
# 2. FILE HANDLING & PERSISTENCE FUNCTIONS
# ==============================================================================

def load_students():
    """
    Reads and returns the list of students from the JSON file.
    If the file does not exist or is empty/corrupt, it safely returns an empty list.
    """
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            if isinstance(data, list):
                return data
            return []
    except json.JSONDecodeError:
        # File exists but contains invalid JSON
        return []
    except Exception as e:
        st.error(f"Error reading {DATA_FILE}: {e}")
        return []


def save_students(students_list):
    """
    Saves the list of student dictionaries into the JSON file with 4-space indentation.
    Returns True if successful, False otherwise.
    """
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump(students_list, file, indent=4)
        return True
    except Exception as e:
        st.error(f"Error saving data to {DATA_FILE}: {e}")
        return False


# ==============================================================================
# 3. VALIDATION HELPER FUNCTIONS
# ==============================================================================

def validate_inputs(roll_no, name, phone):
    """
    Validates form inputs:
    - Roll Number: must not be empty and contains alphanumeric characters
    - Full Name: must be at least 2 characters and contain only letters and spaces
    - Phone Number: must be exactly 10 digits
    Returns (is_valid: bool, error_message: str)
    """
    roll_clean = str(roll_no).strip()
    name_clean = str(name).strip()
    phone_clean = str(phone).strip()

    if not roll_clean:
        return False, "Roll Number cannot be empty."

    if not name_clean or len(name_clean) < 2:
        return False, "Student Name must be at least 2 characters long."

    # Validate that name contains only letters, spaces, and periods
    if not re.match(r"^[A-Za-z\s\.]+$", name_clean):
        return False, "Student Name should contain only letters and spaces."

    # Validate 10-digit phone number
    if not (phone_clean.isdigit() and len(phone_clean) == 10):
        return False, "Phone Number must be exactly 10 digits (e.g., 9876543210)."

    return True, ""


# ==============================================================================
# 4. CRUD (CREATE, READ, UPDATE, DELETE) FUNCTIONS
# ==============================================================================

def add_student(roll_no, name, course, semester, phone):
    """
    Adds a new student to the database after checking for duplicate roll number.
    Returns (success: bool, message: str)
    """
    roll_clean = str(roll_no).strip()
    name_clean = str(name).strip()
    phone_clean = str(phone).strip()

    # Input validation
    is_valid, error_msg = validate_inputs(roll_clean, name_clean, phone_clean)
    if not is_valid:
        return False, error_msg

    students = load_students()

    # Check for duplicate roll number (case-insensitive)
    for s in students:
        if str(s.get("roll_no")).strip().lower() == roll_clean.lower():
            return False, f"A student with Roll Number '{roll_clean}' already exists!"

    new_record = {
        "roll_no": roll_clean,
        "name": name_clean,
        "course": course,
        "semester": semester,
        "phone": phone_clean,
    }

    students.append(new_record)
    if save_students(students):
        return True, f"Student '{name_clean}' (Roll No: {roll_clean}) successfully registered!"
    return False, "Failed to save record to the database."


def search_students(query):
    """
    Searches for students whose Roll Number or Name contains the query string (case-insensitive).
    Returns matching list of student dictionaries.
    """
    students = load_students()
    if not query or not str(query).strip():
        return students

    q = str(query).strip().lower()
    results = []
    for s in students:
        roll = str(s.get("roll_no", "")).lower()
        name = str(s.get("name", "")).lower()
        if q in roll or q in name:
            results.append(s)
    return results


def update_student(roll_no, new_name, new_course, new_semester, new_phone):
    """
    Updates an existing student's details matching the given roll number.
    Returns (success: bool, message: str)
    """
    roll_clean = str(roll_no).strip()
    name_clean = str(new_name).strip()
    phone_clean = str(new_phone).strip()

    is_valid, error_msg = validate_inputs(roll_clean, name_clean, phone_clean)
    if not is_valid:
        return False, error_msg

    students = load_students()
    found = False

    for s in students:
        if str(s.get("roll_no")).strip().lower() == roll_clean.lower():
            s["name"] = name_clean
            s["course"] = new_course
            s["semester"] = new_semester
            s["phone"] = phone_clean
            found = True
            break

    if not found:
        return False, f"Student with Roll Number '{roll_clean}' was not found."

    if save_students(students):
        return True, f"Details for Roll Number '{roll_clean}' updated successfully!"
    return False, "Failed to update record in the database."


def delete_student(roll_no):
    """
    Deletes a student record by Roll Number.
    Returns (success: bool, message: str)
    """
    roll_clean = str(roll_no).strip()
    students = load_students()

    initial_count = len(students)
    updated_students = [
        s for s in students if str(s.get("roll_no")).strip().lower() != roll_clean.lower()
    ]

    if len(updated_students) == initial_count:
        return False, f"Student with Roll Number '{roll_clean}' was not found."

    if save_students(updated_students):
        return True, f"Student with Roll Number '{roll_clean}' deleted successfully!"
    return False, "Failed to delete student from the database."


# ==============================================================================
# 5. HEADER BANNER COMPONENT
# ==============================================================================

def render_banner(title, subtitle):
    """Renders a modern blue header banner with title and subtitle."""
    banner_html = f"""
    <div class="banner-container">
        <h1 class="banner-title">🎓 {title}</h1>
        <p class="banner-subtitle">{subtitle}</p>
    </div>
    """
    st.markdown(banner_html, unsafe_allow_html=True)


# ==============================================================================
# 6. PAGE VIEWS
# ==============================================================================

def page_dashboard():
    """Displays key statistics, summary metrics, and distribution charts."""
    render_banner(
        "Student Database Dashboard",
        "Overview of registered students, department statistics, and recent enrollments",
    )

    students = load_students()
    total_students = len(students)

    # Metric summary row
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-title">Total Registered Students</div>
                <div class="metric-value">{total_students}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col2:
        courses_count = len(set(s.get("course") for s in students)) if students else 0
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-title">Active Courses / Branches</div>
                <div class="metric-value">{courses_count}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col3:
        semesters_count = len(set(s.get("semester") for s in students)) if students else 0
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-title">Active Semesters</div>
                <div class="metric-value">{semesters_count}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    if total_students > 0:
        df = pd.DataFrame(students)

        # Charts Section
        chart_col1, chart_col2 = st.columns(2)

        with chart_col1:
            st.subheader("📊 Students per Course")
            course_counts = df["course"].value_counts()
            st.bar_chart(course_counts, color="#2563EB")

        with chart_col2:
            st.subheader("📈 Students per Semester")
            semester_counts = df["semester"].value_counts().sort_index()
            st.bar_chart(semester_counts, color="#3B82F6")

        # Recent students table
        st.subheader("🕒 Recently Registered Students")
        recent_df = df.tail(5)[["roll_no", "name", "course", "semester", "phone"]]
        recent_df.columns = ["Roll No", "Full Name", "Course", "Semester", "Phone Number"]
        st.dataframe(recent_df, use_container_width=True, hide_index=True)

    else:
        st.info("ℹ️ No students are registered in the database yet. Use the 'Register Student' tab to add your first student record!")


def page_add_student():
    """Form to register a new student with comprehensive validation."""
    render_banner(
        "Register New Student",
        "Fill in the form details below to add a new student record to the JSON database",
    )

    with st.form("add_student_form", clear_on_submit=False):
        st.markdown("### Student Details Form")

        col1, col2 = st.columns(2)

        with col1:
            roll_no = st.text_input(
                "Roll Number *",
                placeholder="e.g., 59 or IT2026-059",
                help="Roll number must be unique across all students",
            )
            name = st.text_input(
                "Full Name *",
                placeholder="e.g., Soham Nitin Dalal",
                help="Enter student's first and last name",
            )
            phone = st.text_input(
                "Phone Number *",
                placeholder="e.g., 9876543210",
                max_chars=10,
                help="10-digit mobile number",
            )

        with col2:
            course = st.selectbox(
                "Course / Branch *",
                options=COURSES_LIST,
                help="Select the engineering department",
            )
            semester = st.selectbox(
                "Current Semester *",
                options=SEMESTER_LIST,
                index=3,  # Defaults to Semester 4
                help="Select the active semester",
            )

        st.markdown("<br>", unsafe_allow_html=True)
        submitted = st.form_submit_button("➕ Save Student Record", type="primary", use_container_width=True)

        if submitted:
            success, message = add_student(roll_no, name, course, semester, phone)
            if success:
                st.success(f"✅ {message}")
                st.balloons()
            else:
                st.error(f"❌ {message}")


def page_view_all():
    """Displays all student records in an interactive table with export functionality."""
    render_banner(
        "All Student Records",
        "View, filter, sort, and export the complete directory of registered students",
    )

    students = load_students()
    total = len(students)

    if total == 0:
        st.warning("⚠️ No student records found. Add students using the 'Register Student' menu.")
        return

    df = pd.DataFrame(students)

    # Filters row
    col_filter1, col_filter2, col_stat = st.columns([1.5, 1.5, 1])

    with col_filter1:
        course_options = ["All Courses"] + sorted(list(df["course"].unique()))
        selected_course = st.selectbox("Filter by Course:", course_options)

    with col_filter2:
        semester_options = ["All Semesters"] + sorted(list(df["semester"].unique()))
        selected_semester = st.selectbox("Filter by Semester:", semester_options)

    # Apply filters
    filtered_df = df.copy()
    if selected_course != "All Courses":
        filtered_df = filtered_df[filtered_df["course"] == selected_course]
    if selected_semester != "All Semesters":
        filtered_df = filtered_df[filtered_df["semester"] == selected_semester]

    with col_stat:
        st.metric("Records Found", len(filtered_df), f"of {total} total")

    # Rename columns for presentation
    display_df = filtered_df[["roll_no", "name", "course", "semester", "phone"]].copy()
    display_df.columns = ["Roll Number", "Full Name", "Course", "Semester", "Phone Number"]

    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True,
    )

    # Download CSV feature
    csv_data = display_df.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="📥 Download Records as CSV",
        data=csv_data,
        file_name="student_database_records.csv",
        mime="text/csv",
    )


def page_search_student():
    """Allows searching by roll number or student name and shows profile cards."""
    render_banner(
        "Search Student Records",
        "Quickly locate any student by typing their Roll Number or Full Name",
    )

    search_query = st.text_input(
        "🔍 Search by Roll Number or Name:",
        placeholder="Type roll number (e.g. 59) or name (e.g. Soham)...",
    )

    if search_query:
        results = search_students(search_query)

        if results:
            st.success(f"🎯 Found {len(results)} matching record(s):")

            # Display individual cards
            for s in results:
                card_html = f"""
                <div class="student-card">
                    <span class="badge-roll">Roll No: {s.get('roll_no')}</span>
                    <div class="student-name">{s.get('name')}</div>
                    <div class="student-detail"><strong>Course:</strong> {s.get('course')}</div>
                    <div class="student-detail"><strong>Semester:</strong> {s.get('semester')}</div>
                    <div class="student-detail"><strong>Phone:</strong> 📞 {s.get('phone')}</div>
                </div>
                """
                st.markdown(card_html, unsafe_allow_html=True)

            # Tabular view as well
            st.markdown("### Tabular View")
            res_df = pd.DataFrame(results)[["roll_no", "name", "course", "semester", "phone"]]
            res_df.columns = ["Roll Number", "Full Name", "Course", "Semester", "Phone Number"]
            st.dataframe(res_df, use_container_width=True, hide_index=True)
        else:
            st.warning(f"❌ No student found matching '{search_query}'. Please check the roll number or name.")
    else:
        st.info("💡 Type in the search box above to find student records instantly.")


def page_update_student():
    """Page to modify details of an existing student record."""
    render_banner(
        "Update Student Details",
        "Select a student by Roll Number to edit their details and save changes",
    )

    students = load_students()

    if not students:
        st.warning("⚠️ No students found in the database to update.")
        return

    # Create dropdown list of roll numbers with names
    student_options = {
        f"{s.get('roll_no')} - {s.get('name')}": s.get("roll_no") for s in students
    }
    selected_label = st.selectbox("Select Student to Update:", list(student_options.keys()))
    selected_roll = student_options[selected_label]

    # Fetch current student details
    target = next((s for s in students if str(s.get("roll_no")) == str(selected_roll)), None)

    if target:
        st.markdown("### Edit Student Information")

        with st.form("update_form"):
            col1, col2 = st.columns(2)

            with col1:
                st.text_input("Roll Number (Primary Key - Fixed)", value=target.get("roll_no"), disabled=True)
                updated_name = st.text_input("Full Name *", value=target.get("name"))
                updated_phone = st.text_input("Phone Number *", value=target.get("phone"), max_chars=10)

            with col2:
                # Pre-select current course and semester
                curr_course = target.get("course")
                course_idx = COURSES_LIST.index(curr_course) if curr_course in COURSES_LIST else 0
                updated_course = st.selectbox("Course / Branch *", options=COURSES_LIST, index=course_idx)

                curr_sem = target.get("semester")
                sem_idx = SEMESTER_LIST.index(curr_sem) if curr_sem in SEMESTER_LIST else 0
                updated_semester = st.selectbox("Current Semester *", options=SEMESTER_LIST, index=sem_idx)

            st.markdown("<br>", unsafe_allow_html=True)
            submit_update = st.form_submit_button("💾 Save Updated Changes", type="primary", use_container_width=True)

            if submit_update:
                success, message = update_student(
                    selected_roll,
                    updated_name,
                    updated_course,
                    updated_semester,
                    updated_phone,
                )
                if success:
                    st.success(f"✅ {message}")
                    st.rerun()
                else:
                    st.error(f"❌ {message}")


def page_delete_student():
    """Page to remove a student record with safety confirmation."""
    render_banner(
        "Delete Student Record",
        "Permanently remove a student record with explicit safety confirmation",
    )

    students = load_students()

    if not students:
        st.warning("⚠️ No students found in the database to delete.")
        return

    student_options = {
        f"{s.get('roll_no')} - {s.get('name')}": s.get("roll_no") for s in students
    }
    selected_label = st.selectbox("Select Student to Delete:", list(student_options.keys()))
    selected_roll = student_options[selected_label]

    target = next((s for s in students if str(s.get("roll_no")) == str(selected_roll)), None)

    if target:
        # Show preview of student to be deleted
        st.markdown(
            f"""
            <div class="student-card" style="border-left: 5px solid #DC2626;">
                <span class="badge-roll" style="background:#FEE2E2; color:#B91C1C; border-color:#FECACA;">
                    Roll No: {target.get('roll_no')}
                </span>
                <div class="student-name" style="color: #991B1B;">{target.get('name')}</div>
                <div class="student-detail"><strong>Course:</strong> {target.get('course')}</div>
                <div class="student-detail"><strong>Semester:</strong> {target.get('semester')}</div>
                <div class="student-detail"><strong>Phone:</strong> {target.get('phone')}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.warning("⚠️ Deleting a record is permanent and cannot be undone!")

        confirm = st.checkbox("I confirm that I want to delete this student record permanently.")

        if st.button("🗑️ Delete Student Record", type="primary", disabled=not confirm, use_container_width=True):
            success, message = delete_student(selected_roll)
            if success:
                st.success(f"✅ {message}")
                st.rerun()
            else:
                st.error(f"❌ {message}")


def page_about_project():
    """Displays project details, author information, and viva concepts."""
    render_banner(
        "About the Project & Viva Guide",
        "Comprehensive documentation of project architecture, Python concepts, and viva voce notes",
    )

    col1, col2 = st.columns([1.2, 1.8])

    with col1:
        st.markdown(
            """
            ### 👨‍🎓 Student Developer Details
            - **Student Name:** Soham Nitin Dalal
            - **Roll Number:** 59
            - **Department:** Second Year Information Technology (SE IT)
            - **Academic Year:** 2026
            - **Course:** Python Mini Project

            ---
            ### 🛠️ Technology Stack
            - **Programming Language:** Python 3
            - **Web Framework:** Streamlit
            - **Data Storage:** JSON (JavaScript Object Notation)
            - **Data Handling:** Pandas DataFrame
            - **Design Theme:** Professional White & Blue
            """
        )

    with col2:
        st.markdown(
            """
            ### 🎯 Project Objectives & Overview
            The **Student Database Management System** is a lightweight, responsive web application designed for educational institutions to manage student records efficiently.
            
            Unlike complex enterprise systems that require heavy database servers (like MySQL or Oracle), this application leverages **JSON-based flat file storage**. This makes the application lightweight, fast, cross-platform, zero-configuration, and ideal for academic demonstrations and college viva.
            """
        )

    st.markdown("---")
    st.subheader("💡 Python & Computer Science Concepts Implemented")

    exp1 = st.expander("1. Modular Functions & Separation of Concerns (CRUD)")
    with exp1:
        st.write(
            """
            - **Create:** `add_student()` validates input, checks for duplicates, and appends the new record.
            - **Read:** `load_students()` and `search_students()` retrieve records from disk and filter them.
            - **Update:** `update_student()` locates the record by primary key (Roll Number) and updates details.
            - **Delete:** `delete_student()` filters out the targeted student record and rewrites the file.
            - Keeping each operation in an independent function makes the codebase clean, testable, and beginner-friendly.
            """
        )

    exp2 = st.expander("2. File Handling & JSON Persistence (`json` module)")
    with exp2:
        st.write(
            """
            - **Serialization (`json.dump`):** Converts Python data structures (lists of dictionaries) into JSON text formatted with indentation.
            - **Deserialization (`json.load`):** Reads the JSON text file and reconstructs native Python dictionaries in memory.
            - **Persistence:** Changes are saved directly to `students.json`, meaning data is retained across application restarts.
            """
        )

    exp3 = st.expander("3. Exception Handling & Robustness (`try...except`)")
    with exp3:
        st.write(
            """
            - Handles `FileNotFoundError` automatically when running for the first time.
            - Handles `json.JSONDecodeError` if the JSON file is empty or corrupted.
            - Wraps input validation around roll numbers, names, and phone numbers to prevent dirty data entry.
            """
        )

    exp4 = st.expander("4. Input Validation & Primary Key Enforcement")
    with exp4:
        st.write(
            """
            - **Uniqueness Check:** The application prevents duplicate Roll Numbers before appending to the database.
            - **Format Validation:** Names must contain valid letters and spaces; phone numbers must be exactly 10 numeric digits.
            """
        )

    st.markdown("---")
    st.subheader("🎓 College Viva Voce Questions & Answers")

    viva_q1 = st.expander("Q1: Why did you choose JSON instead of MySQL for this mini project?")
    with viva_q1:
        st.write(
            "**Answer:** JSON is lightweight, human-readable, requires zero external database installation, and stores structured key-value data naturally. For a mini project, it eliminates connection overhead and dependencies while providing full data persistence."
        )

    viva_q2 = st.expander("Q2: What is Streamlit and how does it work?")
    with viva_q2:
        st.write(
            "**Answer:** Streamlit is an open-source Python framework used to create interactive web applications for data science and machine learning. Whenever a user interacts with a widget (button, input, dropdown), Streamlit re-executes the script from top to bottom, updating the interface seamlessly."
        )

    viva_q3 = st.expander("Q3: How do you prevent duplicate roll numbers in your application?")
    with viva_q3:
        st.write(
            "**Answer:** In the `add_student()` function, we iterate over existing records and compare the input roll number (case-insensitively) against `s['roll_no']`. If a match is found, an error is returned and the record is not added."
        )

    viva_q4 = st.expander("Q4: How does the application handle missing or corrupted data files?")
    with viva_q4:
        st.write(
            "**Answer:** We use Python's `os.path.exists()` and a `try...except` block with `json.JSONDecodeError`. If the file doesn't exist or is corrupted, `load_students()` safely returns an empty list `[]` instead of crashing the program."
        )


# ==============================================================================
# 7. MAIN ENTRY POINT & SIDEBAR ROUTING
# ==============================================================================

def main():
    # Sidebar Header
    st.sidebar.markdown(
        """
        <div style="text-align: center; padding: 10px 0;">
            <h2 style="color: #1E3A8A; margin: 0;">🎓 EduTrack</h2>
            <p style="color: #64748B; font-size: 13px; margin: 2px 0;">Student Database Management</p>
        </div>
        <hr style="margin: 10px 0;">
        """,
        unsafe_allow_html=True,
    )

    # Navigation Menu
    menu_options = [
        "📊 Dashboard",
        "➕ Register Student",
        "📋 View All Students",
        "🔍 Search Student",
        "✏️ Update Student",
        "🗑️ Delete Student",
        "ℹ️ About Project",
    ]

    choice = st.sidebar.radio("Navigation Menu", menu_options, index=0)

    # Sidebar Developer Card
    st.sidebar.markdown(
        """
        <div class="dev-badge">
            <strong>👤 Developer Details:</strong><br>
            <strong>Name:</strong> Soham Nitin Dalal<br>
            <strong>Roll No:</strong> 59<br>
            <strong>Department:</strong> SE Information Technology<br>
            <strong>Storage:</strong> JSON Database
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Page Routing
    if choice == "📊 Dashboard":
        page_dashboard()
    elif choice == "➕ Register Student":
        page_add_student()
    elif choice == "📋 View All Students":
        page_view_all()
    elif choice == "🔍 Search Student":
        page_search_student()
    elif choice == "✏️ Update Student":
        page_update_student()
    elif choice == "🗑️ Delete Student":
        page_delete_student()
    elif choice == "ℹ️ About Project":
        page_about_project()


if __name__ == "__main__":
    main()

