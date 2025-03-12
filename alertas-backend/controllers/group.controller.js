const Group = require("../models/Group");
const Neighbor = require("../models/Neighbor");
const { addGroupToNeighbors } = require("../services/neighborService");

// Obtener todos los grupos
async function getAllGroups(req, res) {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los grupos" });
  }
}

async function getGroupsByNeighbor(req, res) {
  try {
    const { userId } = req.params;
    const neighbor = await Neighbor.findOne({ uid: userId }).populate("groups");

    neighbor
      ? res.status(200).json(neighbor.groups)
      : res.status(404).json({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los grupos del usuario" });
  }
}

// Crear un nuevo grupo
async function createGroup(req, res) {
  try {
    const newGroup = new Group(req.body);
    const groupSaved = await newGroup.save();
    // Neighbor.updateMany(newGroup.)
    const updatedNeighbors = await addGroupToNeighbors(groupSaved._id, groupSaved.neighbours, newGroup.admins[0]);
    res.status(201).json({groupSaved: groupSaved, updatedNeighbors: updatedNeighbors});
  } catch (error) {
    res.status(500).json({ error: "Error al crear el grupo" });
  }
}

// Obtener un grupo por su ID
async function getGroupById(req, res) {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el grupo" });
  }
}

// Actualizar un grupo existente
async function updateGroup(req, res) {
  try {
    const { id } = req.params;
    const updatedGroup = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el grupo - " + error.message });
  }
}

// Eliminar un grupo existente
async function deleteGroup(req, res) {
  try {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    res.json({ message: "Grupo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el grupo" });
  }
}

module.exports = {
  getAllGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupsByNeighbor,
};
