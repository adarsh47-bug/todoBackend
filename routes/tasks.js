const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate token
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Create a task
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  try {
    const task = new Task({ title, userId: req.user });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  const { completed } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
