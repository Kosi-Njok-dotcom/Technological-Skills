const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [ 'IOTS', 'IT', 'Normal Basic Computer', 'All' ],
        required: true
    },
    tutor: {
        type: String,
        ref:'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);