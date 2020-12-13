const express = require("express");
const path = require('path');
const router = express.Router();

// Handles any requests that don't match the ones above
router.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'./../client/build/index.html'));
});

module.exports = router;