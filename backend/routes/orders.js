const express = require('express');
const router = express.Router();

// Mock orders data
router.get('/', async (req, res) => {
  try {
    res.json({
      orders: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
