const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        maxlength: 500
    },

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model('Category', categorySchema);