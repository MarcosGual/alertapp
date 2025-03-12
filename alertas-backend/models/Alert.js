const mongoose = require('mongoose');
// const Message = require('./Message');
const { messageSchema } = require('./Message');
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String
    },
    geolocation: {
        type: Object,
        default: null
    },
    level: {
        type: [Number]
    },
    active: {
        type: [Boolean],
        default: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Neighbor'
    },
    group: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    }],
    messages: [messageSchema],
    imageUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
})

alertSchema.pre('save', function (next) {
    this.modifiedAt = new Date();
    next();
});

const Alert = new mongoose.model('Alert', alertSchema);

module.exports = { Alert, alertSchema };