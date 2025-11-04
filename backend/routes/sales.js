const express = require('express');
const router = express.Router();

// Mock sales data
router.get('/', async (req, res) => {
  try {
    res.json({
      sales: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
