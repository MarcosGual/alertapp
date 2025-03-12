const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');

router.get('/', groupController.getAllGroups);
router.get('/neighbor/:userId', groupController.getGroupsByNeighbor);
router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;