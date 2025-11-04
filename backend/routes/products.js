const express = require('express');
const router = express.Router();

// Mock products data
router.get('/', async (req, res) => {
  try {
    res.json({
      products: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
