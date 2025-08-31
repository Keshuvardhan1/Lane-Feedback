const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const feedback = new Feedback({ title, description, category });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { sort, category, q } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: 'i' };

    let query = Feedback.find(filter);

    if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else {
      query = query.sort({ createdAt: -1 }); // newest first (default)
    }

    const feedbacks = await query.exec();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/vote', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
