import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables (Make sure you have a .env file with MONGO_URI)
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/attendance_db")

def generate_dbatu_report(class_code):
    """
    Connects to MongoDB, calculates attendance percentages, 
    and exports a DBATU-formatted CSV for term-work submission.
    """
    print(f"Generating term-work report for Course Code: {class_code}...")

    # 1. Connect to Database
    client = MongoClient(MONGO_URI)
    db = client.get_database() # Uses the DB name from the URI

    # 2. Fetch the Class ID
    course = db.classes.find_one({"courseCode": class_code})
    if not course:
        print(f"Error: Course {class_code} not found.")
        return

    class_id = course['_id']

    # 3. Fetch all completed sessions (lectures) for this class
    sessions = list(db.sessions.find({"classId": class_id, "isActive": False}))
    total_lectures = len(sessions)
    
    if total_lectures == 0:
        print("No completed lectures found for this course.")
        return

    # 4. Fetch all students enrolled in this class
    enrolled_students = list(db.students.find({"enrolledClasses": class_id}))
    
    # 5. Process the data
    report_data = []

    for student in enrolled_students:
        student_id = student['_id']
        attended_count = 0

        # Count how many sessions this specific student attended
        for session in sessions:
            # Check if student_id exists in the attendees list for this session
            if any(str(attendee.get('studentId')) == str(student_id) for attendee in session.get('attendees', [])):
                attended_count += 1

        # Calculate percentage
        attendance_percentage = round((attended_count / total_lectures) * 100, 2)

        # Determine Defaulter Status (DBATU generally requires 75% minimum)
        status = "Eligible" if attendance_percentage >= 75.0 else "Defaulter"

        # Format row for the DBATU Portal
        report_data.append({
            "PRN Number": student.get('prnNumber', 'N/A'),
            "Student Name": student.get('name', 'Unknown'),
            "Branch": student.get('branch', 'N/A'),
            "Total Lectures": total_lectures,
            "Lectures Attended": attended_count,
            "Attendance (%)": attendance_percentage,
            "Term-Work Status": status
        })

    # 6. Generate the Spreadsheet
    df = pd.DataFrame(report_data)
    
    # Sort by PRN Number for easy faculty reference
    df = df.sort_values(by="PRN Number")

    # Save to CSV
    filename = f"{class_code}_termwork_report.csv"
    df.to_csv(filename, index=False)
    
    print(f"✅ Success! Report generated: {filename}")
    print(df.head()) # Preview the first few rows in the terminal

# Example Trigger
if __name__ == "__main__":
    # In production, this would be triggered by an API call from the Node backend
    # For testing, you can run this script directly in the terminal
    generate_dbatu_report("MT101")