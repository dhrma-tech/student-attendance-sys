class CSVGenerator {
  static generateAttendanceCSV(report) {
    const headers = [
      'Date',
      'Class Code',
      'Class Name',
      'Teacher',
      'Total Students',
      'Attendees',
      'Attendance %',
      'Student Name',
      'PRN Number',
      'Attendance Time'
    ];

    const rows = report.flatMap(session => {
      return session.attendees.map(attendee => [
        new Date(session.date).toLocaleDateString(),
        session.class?.courseCode || 'N/A',
        session.class?.courseName || 'N/A',
        session.teacher?.name || 'N/A',
        session.totalStudents,
        session.attendeesCount,
        `${session.attendancePercentage}%`,
        attendee.studentId?.name || 'N/A',
        attendee.studentId?.prnNumber || 'N/A',
        new Date(attendee.timestamp).toLocaleTimeString()
      ]);
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static generateStudentListCSV(students) {
    const headers = [
      'Name',
      'PRN Number',
      'Email',
      'Branch',
      'Year',
      'Parent Phone',
      'Device Registered'
    ];

    const rows = students.map(student => [
      student.name,
      student.prnNumber,
      student.email,
      student.branch,
      student.year,
      student.parentPhone,
      student.registeredDeviceId ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

module.exports = CSVGenerator;
