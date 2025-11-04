const express = require('express');
const router = express.Router();

// Mock notifications data
router.get('/', async (req, res) => {
  try {
    res.json({
      notifications: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
