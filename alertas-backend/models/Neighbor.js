const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceTokenSchema = new Schema({
  type: {
    type: String,
  },
  data: {
    type: String,
    unique: true,
  },
});

const neighborSchema = new Schema({
  uid: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: Number,
    unique: false,
  },
  address: {
    type: String,
  },
  neighborhood: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  imageUrl: { type: String, default: null },
  notificationPreferences: {
    securityAlerts: {
      1: { type: Boolean, default: true },
      2: { type: Boolean, default: false },
      3: { type: Boolean, default: false },
      4: { type: Boolean, default: false },
    },
    proximityAlerts: { type: Boolean, default: false }, // Notificaciones de alertas de cercanía
  },
  locationHistory: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  lastLocation: {
    type: [{ type: Number }],
    index: "2dsphere",
  },
  lastLocationTime: { type: Date, default: Date.now },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Referencia al modelo de Group
    },
  ],
  adminOfGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Referencia al modelo de Group
    },
  ],
  deviceTokens: [deviceTokenSchema],
  terms: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

neighborSchema.index({ locationHistory: "2dsphere" });

neighborSchema.pre("save", function (next) {
  this.modifiedAt = new Date();
  next();
});

const Neighbor = mongoose.model("Neighbor", neighborSchema);

module.exports = Neighbor;
