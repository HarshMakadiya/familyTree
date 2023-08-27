const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController.js');

router.get('/', personController.getAllPerson);
router.post('/', personController.addPerson);
router.delete('/', personController.deletePerson);
router.put('/', personController.editPerson);

module.exports = router;
