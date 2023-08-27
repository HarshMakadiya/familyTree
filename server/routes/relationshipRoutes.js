const express = require('express');
const router = express.Router();
const relationshipController = require('../controllers/relationshipController.js');

router.get('/', relationshipController.getAllRelationship);

module.exports = router;
