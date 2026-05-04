const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_secreta_super_segura";
const MONGO_URI = "mongodb+srv://joseejimenez1411_db_user:ha4A9GE153AKQOCu@cluster0.hzcqvaf.mongodb.net/MiChatApp?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB con exito'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

const mensajeSchema = new mongoose.Schema({
    remitenteId: String,
    remitenteNombre: String,
    destinatarioId: String,
    texto: String,
    fecha: { type: Date, default: Date.now },
    borradoPor: { type: [String], default: [] }
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

app.post('/api/auth/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ error: "El email ya está en uso" });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });

        const passCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passCorrecta) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, { password: 0 }); 
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/mensajes/limpiar-local', async (req, res) => {
    const { usuarioId, contactoId } = req.body;
    try {
        await Mensaje.updateMany(
            {
                $or: [
                    { remitenteId: usuarioId, destinatarioId: contactoId },
                    { remitenteId: contactoId, destinatarioId: usuarioId }
                ]
            },
            { $addToSet: { borradoPor: usuarioId } } 
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/mensajes/borrar-definitivo', async (req, res) => {
    const { usuarioId, contactoId } = req.body;
    try {
        await Mensaje.deleteMany({
            $or: [
                { remitenteId: usuarioId, destinatarioId: contactoId },
                { remitenteId: contactoId, destinatarioId: usuarioId }
            ]
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const usuariosConectados = new Map();

const emitirUsuariosConectados = () => {
    io.emit('usuarios_conectados', Array.from(usuariosConectados.keys()));
};

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error("Autenticación denegada"));
    }

    jwt.verify(token, JWT_SECRET, (err, decodificado) => {
        if (err) return next(new Error("Token inválido"));

        socket.data.userId = decodificado.id;
        socket.data.nombre = decodificado.nombre;
        next();
    });
});

io.on('connection', (socket) => {
    const userId = socket.data.userId;
    console.log(`Usuario conectado autenticado: ${socket.data.nombre} (${userId})`);

    usuariosConectados.set(userId, socket.id);
    emitirUsuariosConectados();

    socket.on('solicitar_historial', async ({ usuarioId, contactoId }) => {
        const mensajes = await Mensaje.find({
            $or: [
                { remitenteId: usuarioId, destinatarioId: contactoId },
                { remitenteId: contactoId, destinatarioId: usuarioId }
            ],
            borradoPor: { $ne: usuarioId } 
        }).sort({ fecha: 1 });
        
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

            const socketDestinatario = usuariosConectados.get(data.destinatarioId);
            if (socketDestinatario) {
                io.to(socketDestinatario).emit('recibir_mensaje', nuevoMensaje);
            }

            socket.emit('recibir_mensaje', nuevoMensaje);

        } catch (error) {
            console.error("Error guardando el mensaje:", error);
        }
    });

    socket.on('borrar_para_mi', async ({ usuarioId, contactoId }) => {
        try {
            await Mensaje.updateMany(
                {
                    $or: [
                        { remitenteId: usuarioId, destinatarioId: contactoId },
                        { remitenteId: contactoId, destinatarioId: usuarioId }
                    ]
                },
                { $addToSet: { borradoPor: usuarioId } } 
            );
            socket.emit('chat_limpiado');
        } catch (error) {
            console.error("Error borrando localmente:", error);
        }
    });

    socket.on('borrar_para_todos', async ({ usuarioId, contactoId }) => {
        try {
            await Mensaje.deleteMany({
                $or: [
                    { remitenteId: usuarioId, destinatarioId: contactoId },
                    { remitenteId: contactoId, destinatarioId: usuarioId }
                ]
            });

            const datosChat = { usuario1: usuarioId, usuario2: contactoId };
            
            socket.emit('chat_limpiado', datosChat);

            const socketDestinatario = usuariosConectados.get(contactoId);
            if (socketDestinatario) {
                io.to(socketDestinatario).emit('chat_limpiado', datosChat);
            }
        } catch (error) {
            console.error("Error borrando para todos:", error);
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