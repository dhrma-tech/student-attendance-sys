const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const createClass = async (classData) => {
  const { courseCode, courseName, branch, semester, teacherId, studentIds } = classData;

  // Check if class already exists
  const existingClass = await Class.findOne({ courseCode });
  if (existingClass) {
    throw new AppError('Class with this course code already exists.', 409);
  }

  // Verify teacher exists
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new AppError('Teacher not found.', 404);
  }

  // Verify students exist
  const students = await Student.find({ _id: { $in: studentIds } });
  if (students.length !== studentIds.length) {
    throw new AppError('One or more students not found.', 404);
  }

  const newClass = new Class({
    courseCode,
    courseName,
    branch,
    semester,
    teacherId,
    students: studentIds
  });

  await newClass.save();

  // Update teacher's assigned classes
  teacher.assignedClasses.push(newClass._id);
  await teacher.save();

  // Update students' enrolled classes
  await Student.updateMany(
    { _id: { $in: studentIds } },
    { $push: { enrolledClasses: newClass._id } }
  );

  logger.info(`Class created: ${courseCode} with ${studentIds.length} students`);

  return newClass;
};

const getClasses = async (page = 1, limit = 10, branch, semester, teacherId) => {
  const filter = {};
  if (branch) filter.branch = branch;
  if (semester) filter.semester = parseInt(semester);
  if (teacherId) filter.teacherId = teacherId;

  const classes = await Class.find(filter)
    .populate('teacherId', 'name email department')
    .populate('students', 'name prnNumber email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Class.countDocuments(filter);

  return {
    classes,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  };
};

const updateClass = async (classId, updateData) => {
  const classData = await Class.findById(classId);
  if (!classData) {
    throw new AppError('Class not found.', 404);
  }

  // Handle student list updates
  if (updateData.studentIds) {
    const oldStudentIds = classData.students.map(id => id.toString());
    const newStudentIds = updateData.studentIds;

    // Find students to add and remove
    const toAdd = newStudentIds.filter(id => !oldStudentIds.includes(id));
    const toRemove = oldStudentIds.filter(id => !newStudentIds.includes(id));

    // Add new students
    if (toAdd.length > 0) {
      await Student.updateMany(
        { _id: { $in: toAdd } },
        { $push: { enrolledClasses: classId } }
      );
    }

    // Remove old students
    if (toRemove.length > 0) {
      await Student.updateMany(
        { _id: { $in: toRemove } },
        { $pull: { enrolledClasses: classId } }
      );
    }

    updateData.students = newStudentIds;
    delete updateData.studentIds;
  }

  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    updateData,
    { new: true, runValidators: true }
  ).populate('teacherId', 'name email department')
    .populate('students', 'name prnNumber email');

  logger.info(`Class updated: ${classId}`);

  return updatedClass;
};

const deleteClass = async (classId) => {
  const classData = await Class.findById(classId);
  if (!classData) {
    throw new AppError('Class not found.', 404);
  }

  // Remove class from teacher's assigned classes
  await Teacher.findByIdAndUpdate(
    classData.teacherId,
    { $pull: { assignedClasses: classId } }
  );

  // Remove class from students' enrolled classes
  await Student.updateMany(
    { enrolledClasses: classId },
    { $pull: { enrolledClasses: classId } }
  );

  // Delete the class
  await Class.findByIdAndDelete(classId);

  logger.info(`Class deleted: ${classId}`);

  return { message: 'Class deleted successfully' };
};

const getClassStats = async () => {
  const totalClasses = await Class.countDocuments();
  const classesByBranch = await Class.aggregate([
    { $group: { _id: '$branch', count: { $sum: 1 } } }
  ]);
  const classesBySemester = await Class.aggregate([
    { $group: { _id: '$semester', count: { $sum: 1 } } }
  ]);

  return {
    totalClasses,
    classesByBranch,
    classesBySemester
  };
};

module.exports = {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  getClassStats
};
