const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        default: Date.now
    },
    alertId: {
        type: mongoose.Types.ObjectId,
    },
    authorUid: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    imgUrl:{
        type: String
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    }
})

messageSchema.pre('save', function (next) {
    this.lastModifiedAt = new Date();
    next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message, messageSchema };