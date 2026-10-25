const mongoose = require("mongoose");

const plantaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    categoria: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    descripcion: {
        type: String
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        min: 0,
        default: 0
    }
});

plantaSchema.index({ nombre: 1 });
plantaSchema.index({ categoria: 1 });

module.exports = mongoose.model("Planta", plantaSchema);