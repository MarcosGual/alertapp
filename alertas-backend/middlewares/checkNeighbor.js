const Neighbor = require("../models/Neighbor");

const checkNeighbor = async (req, res, next) => {
  try {
    const neighbor = await Neighbor.findOne({ email: req.body.email });
    if (neighbor) {
      await Neighbor.findOneAndUpdate({ email: req.body.email }, req.body);
      res.json({ msg: "Vecino actualizado" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Error actualizar el vecino - " + error.message });
  }
};

module.exports = checkNeighbor;