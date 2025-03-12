const Neighbor = require('../models/Neighbor');

async function getNeighborsByGroupId(groupId) {
    try {
      const neighbors = await Neighbor.find({ groups: groupId }).populate('groups');
      return neighbors;
    } catch (error) {
      throw new Error('Error al obtener los vecinos del grupo');
    }
  }