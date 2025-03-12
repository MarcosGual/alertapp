const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupName: String,
  neighbours: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Neighbor", // Referencia al modelo
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Neighbor", // Referencia al modelo
    },
  ],
  alerts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
    },
  ],
  neighborhoods: [
    {
      type: String,
    },
  ],
  city: String,
  country: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

groupSchema.pre("save", function (next) {
  this.modifiedAt = new Date();
  next();
});

const Grupo = mongoose.model("Group", groupSchema);

module.exports = Grupo;
