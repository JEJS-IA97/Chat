const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const usuariosConectados = new Map();

const MONGO_URI = "mongodb+srv://joseejimenez1411_db_user:ha4A9GE153AKQOCu@cluster0.hzcqvaf.mongodb.net/MiChatApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB con exito'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

const mensajeSchema = new mongoose.Schema({
    remitenteId: String,
    remitenteNombre: String,
    destinatarioId: String,
    texto: String,
    fecha: { type: Date, default: Date.now }
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

const emitirUsuariosConectados = () => {
    io.emit('usuarios_conectados', Array.from(usuariosConectados.keys()));
};

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    Mensaje.find().sort({ fecha: 1 }).then((mensajes) => {
        socket.emit('historial_mensajes', mensajes);
    });

    socket.on('registrar_usuario', (userId) => {
        if (!userId) return;

        socket.data.userId = userId;
        usuariosConectados.set(userId, socket.id);
        emitirUsuariosConectados();
    });

    socket.on('enviar_mensaje', async (data) => {
        try {
            const nuevoMensaje = new Mensaje({
                remitenteId: data.remitenteId,
                remitenteNombre: data.remitenteNombre,
                destinatarioId: data.destinatarioId,
                texto: data.texto
            });

            await nuevoMensaje.save();
            io.emit('recibir_mensaje', nuevoMensaje);
        } catch (error) {
            console.error("Error guardando el mensaje:", error);
        }
    });

    socket.on('disconnect', () => {
        if (socket.data.userId) {
            usuariosConectados.delete(socket.data.userId);
            emitirUsuariosConectados();
        }

        console.log('Usuario desconectado');
    });
});

const PUERTO = process.env.PORT || 3000;

server.listen(PUERTO, () => {
    console.log(`Servidor de chat corriendo en el puerto: ${PUERTO}`);
});
