const mongoose = require("mongoose");

const direccionSchema = new mongoose.Schema({
    calle: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Direccion", direccionSchema);