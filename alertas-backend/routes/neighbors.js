const express = require('express');
const router = express.Router();
const neighborController = require('../controllers/neighbor.controller');
const checkNeighbor = require('../middlewares/checkNeighbor');

router.get('/', neighborController.getAllNeighbors);
router.get('/:id', neighborController.getNeighborByUid);
router.get('/group/:groupId', neighborController.getNeighborsByGroupId);

router.post('/array', neighborController.getNeighborsArrayByUids);
router.post('/', checkNeighbor, neighborController.createNeighbor);

router.put('/token/:id', neighborController.saveNeighborToken);
router.put('/:id', neighborController.updateNeighbor);
router.put('/locations/:uid', neighborController.updateNeighborLocations);

router.delete('/:id', neighborController.deleteNeighbor);

module.exports = router;