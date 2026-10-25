const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ["pendiente", "enviado", "entregado"],
        default: "pendiente"
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioTotal: {
        type: Number,
        required: true,
        min: 0
    },

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    direccion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Direccion",
        required: true
    },

    planta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Planta",
        required: true
    }
});

module.exports = mongoose.model("Pedido", pedidoSchema);