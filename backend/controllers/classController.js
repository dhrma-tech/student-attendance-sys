const classService = require('../services/classService');

const createClass = async (req, res, next) => {
  try {
    const classData = req.body;
    const newClass = await classService.createClass(classData);
    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    next(error);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, branch, semester, teacherId } = req.query;
    const result = await classService.getClasses(page, limit, branch, semester, teacherId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const updateData = req.body;
    const updatedClass = await classService.updateClass(classId, updateData);
    res.json({
      message: 'Class updated successfully',
      class: updatedClass
    });
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const result = await classService.deleteClass(classId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getClassStats = async (req, res, next) => {
  try {
    const stats = await classService.getClassStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  getClassStats
};
