require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || '*';

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MiChatApp API',
            version: '1.0.0',
            description: 'API de mensajería con autenticación JWT y gestión de contactos',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    },
    apis: ['./server.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((origin) => origin.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
}));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map((origin) => origin.trim()),
        methods: ["GET", "POST"]
    }
});

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const shouldSkipDb = process.env.SKIP_DB === 'true';

if (shouldSkipDb) {
    console.log('MongoDB omitido temporalmente con SKIP_DB=true');
} else {
    if (!JWT_SECRET) {
        throw new Error('Falta JWT_SECRET en las variables de entorno.');
    }

    if (!MONGO_URI) {
        throw new Error('Falta MONGO_URI en las variables de entorno.');
    }

    mongoose.connect(MONGO_URI)
        .then(() => console.log('Conectado a MongoDB con exito'))
        .catch(err => console.error('Error conectando a MongoDB:', err));
}

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    solicitudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]
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

app.get('/api/health', (_req, res) => {
    const estadosMongo = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    res.status(200).json({
        api: 'ok',
        dbState: shouldSkipDb ? 'skipped' : (estadosMongo[mongoose.connection.readyState] || 'unknown')
    });
});

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

app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)
            .populate('contactos', 'nombre email _id')
            .populate('solicitudes', 'nombre email _id');

        res.status(200).json({ contactos: usuario.contactos, solicitudes: usuario.solicitudes });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

app.get('/api/usuarios/perfil/:email', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ email: req.params.email }).select('-password');
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/usuarios/modificar', async (req, res) => {
    try {
        const { email, nuevoNombre, nuevaPassword } = req.body;
        const updates = {};
        
        if (nuevoNombre) updates.nombre = nuevoNombre;
        if (nuevaPassword) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(nuevaPassword, salt);
        }

        const usuario = await Usuario.findOneAndUpdate({ email }, updates, { new: true }).select('-password');
        res.status(200).json({ mensaje: "Usuario actualizado", usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/usuarios/eliminar/:email', async (req, res) => {
    try {
        const resultado = await Usuario.findOneAndDelete({ email: req.params.email });
        if (!resultado) return res.status(404).json({ error: "No se encontró el usuario para eliminar" });
        
        // Opcional: Borrar también sus mensajes
        await Mensaje.deleteMany({ $or: [{ remitenteId: resultado._id }, { destinatarioId: resultado._id }] });

        res.status(200).json({ mensaje: "Usuario y datos relacionados eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contactos/agregar', async (req, res) => {
    const { miId, emailContacto } = req.body;
    try {
        const nuevoContacto = await Usuario.findOne({ email: emailContacto });
        if (!nuevoContacto) return res.status(404).json({ error: "No existe un usuario registrado con ese correo." });
        if (nuevoContacto._id.toString() === miId) return res.status(400).json({ error: "No puedes agregarte a ti mismo." });

        await Usuario.findByIdAndUpdate(miId, { $addToSet: { contactos: nuevoContacto._id } });
        await Usuario.findByIdAndUpdate(nuevoContacto._id, { $addToSet: { contactos: miId } });

        res.status(200).json({ success: true, mensaje: "Contacto agregado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contactos/solicitar', async (req, res) => {
    const { miId, emailContacto } = req.body;
    try {
        const contacto = await Usuario.findOne({ email: emailContacto });
        if (!contacto) return res.status(404).json({ error: "No existe un usuario con ese correo." });
        if (contacto._id.toString() === miId) return res.status(400).json({ error: "No puedes agregarte a ti mismo." });
        if (contacto.contactos.includes(miId)) return res.status(400).json({ error: "Ya son contactos." });
        if (contacto.solicitudes.includes(miId)) return res.status(400).json({ error: "Ya le enviaste una solicitud." });

        await Usuario.findByIdAndUpdate(contacto._id, { $addToSet: { solicitudes: miId } });
        res.status(200).json({ success: true, mensaje: "Solicitud enviada. Esperando que acepte." });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

app.post('/api/contactos/aceptar', async (req, res) => {
    const { miId, solicitanteId } = req.body;
    try {

        await Usuario.findByIdAndUpdate(miId, { 
            $addToSet: { contactos: solicitanteId }, 
            $pull: { solicitudes: solicitanteId } 
        });
        await Usuario.findByIdAndUpdate(solicitanteId, { 
            $addToSet: { contactos: miId } 
        });

        res.status(200).json({ success: true, mensaje: "Contacto aceptado" });
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

    socket.on('escribiendo', ({ de, para }) => {
        const socketDest = usuariosConectados.get(para);
        if (socketDest) io.to(socketDest).emit('escribiendo', de);
    });

    socket.on('dejo_de_escribir', ({ de, para }) => {
        const socketDest = usuariosConectados.get(para);
        if (socketDest) io.to(socketDest).emit('dejo_de_escribir', de);
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

const startServer = (puerto = PUERTO) => server.listen(puerto, () => {
    console.log(`Servidor de chat corriendo en el puerto: ${puerto}`);
});

if (require.main === module) {
    startServer();
}

module.exports = {
    app,
    io,
    server,
    startServer
};
