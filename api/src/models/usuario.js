const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 2
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    telefono: {
        type: String
    },
    contraseña: {
        type: String,
        required: true,
        minlength: 6
    },
    rol: {
        type: String,
        enum: ["cliente", "admin"],
        default: "cliente"
    }
});

usuarioSchema.index({ email: 1 });

module.exports = mongoose.model("Usuario", usuarioSchema);