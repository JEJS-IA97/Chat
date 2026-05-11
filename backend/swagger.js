const normalizeServerUrl = (value) => {
    const rawValue = value?.trim();

    if (!rawValue) return null;

    const normalized = rawValue.replace(/\/$/, '');
    return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
};

const buildServers = () => {
    const servers = [];
    const productionUrl = normalizeServerUrl(
        process.env.PUBLIC_API_URL || process.env.RENDER_EXTERNAL_URL
    );

    if (productionUrl) {
        servers.push({
            url: productionUrl,
            description: 'Produccion'
        });
    }

    servers.push({
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local'
    });

    return servers;
};

const buildSwaggerSpec = () => ({
    openapi: '3.0.0',
    info: {
        title: 'MiChatApp API',
        version: '1.0.0',
        description: [
            'API HTTP de MiChatApp para autenticacion, usuarios, contactos y mantenimiento de mensajes.',
            'La mensajeria en tiempo real usa Socket.IO y no aparece en esta documentacion.'
        ].join(' ')
    },
    servers: buildServers(),
    tags: [
        { name: 'Health', description: 'Verificacion rapida del estado de la API' },
        { name: 'Auth', description: 'Registro e inicio de sesion' },
        { name: 'Usuarios', description: 'Consulta y mantenimiento de usuarios' },
        { name: 'Contactos', description: 'Flujos para agregar y aceptar contactos' },
        { name: 'Mensajes', description: 'Acciones HTTP de limpieza y borrado de mensajes' }
    ],
    components: {
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        example: 'Ocurrio un error inesperado'
                    }
                }
            },
            HealthResponse: {
                type: 'object',
                properties: {
                    api: {
                        type: 'string',
                        example: 'ok'
                    },
                    dbState: {
                        type: 'string',
                        enum: ['connected', 'connecting', 'disconnected', 'disconnecting', 'skipped', 'unknown'],
                        example: 'connected'
                    }
                }
            },
            AuthRegisterRequest: {
                type: 'object',
                required: ['nombre', 'email', 'password'],
                properties: {
                    nombre: {
                        type: 'string',
                        example: 'Jose'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'jose@example.com'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        example: 'Qa123456!'
                    }
                }
            },
            AuthLoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'jose@example.com'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        example: 'Qa123456!'
                    }
                }
            },
            AuthUser: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abc'
                    },
                    nombre: {
                        type: 'string',
                        example: 'Jose'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'jose@example.com'
                    }
                }
            },
            AuthLoginResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    usuario: {
                        $ref: '#/components/schemas/AuthUser'
                    }
                }
            },
            UserSummary: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abc'
                    },
                    nombre: {
                        type: 'string',
                        example: 'Ana'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'ana@example.com'
                    }
                }
            },
            UserProfile: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abc'
                    },
                    nombre: {
                        type: 'string',
                        example: 'Jose'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'jose@example.com'
                    },
                    contactos: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        example: ['6820ba3e6f6cb92dd5413abd']
                    },
                    solicitudes: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        example: ['6820ba3e6f6cb92dd5413abe']
                    }
                }
            },
            UserCollectionsResponse: {
                type: 'object',
                properties: {
                    contactos: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/UserSummary'
                        }
                    },
                    solicitudes: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/UserSummary'
                        }
                    }
                }
            },
            UpdateUserRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'jose@example.com'
                    },
                    nuevoNombre: {
                        type: 'string',
                        example: 'Jose QA'
                    },
                    nuevaPassword: {
                        type: 'string',
                        format: 'password',
                        example: 'NuevaClave123!'
                    }
                }
            },
            UpdateUserResponse: {
                type: 'object',
                properties: {
                    mensaje: {
                        type: 'string',
                        example: 'Usuario actualizado'
                    },
                    usuario: {
                        $ref: '#/components/schemas/UserProfile'
                    }
                }
            },
            ContactRequest: {
                type: 'object',
                required: ['miId', 'emailContacto'],
                properties: {
                    miId: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abc'
                    },
                    emailContacto: {
                        type: 'string',
                        format: 'email',
                        example: 'ana@example.com'
                    }
                }
            },
            AcceptContactRequest: {
                type: 'object',
                required: ['miId', 'solicitanteId'],
                properties: {
                    miId: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abc'
                    },
                    solicitanteId: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abd'
                    }
                }
            },
            MessageActionRequest: {
                type: 'object',
                required: ['usuarioId', 'contactoId'],
                properties: {
                    usuarioId: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abc'
                    },
                    contactoId: {
                        type: 'string',
                        example: '6820ba3e6f6cb92dd5413abd'
                    }
                }
            },
            SuccessResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true
                    },
                    mensaje: {
                        type: 'string',
                        example: 'Operacion completada'
                    }
                }
            }
        }
    },
    paths: {
        '/api/health': {
            get: {
                tags: ['Health'],
                summary: 'Consultar estado de la API',
                description: 'Devuelve el estado basico de la API y el estado actual de la conexion con MongoDB.',
                responses: {
                    200: {
                        description: 'Estado actual de la API',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/HealthResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/registro': {
            post: {
                tags: ['Auth'],
                summary: 'Registrar un nuevo usuario',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthRegisterRequest'
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Usuario creado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: {
                                            type: 'string',
                                            example: 'Usuario creado exitosamente'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Email ya registrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Iniciar sesion',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthLoginRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Login exitoso',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthLoginResponse'
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Credenciales invalidas',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/usuarios/{id}': {
            get: {
                tags: ['Usuarios'],
                summary: 'Obtener contactos y solicitudes de un usuario',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string'
                        },
                        description: 'ID del usuario'
                    }
                ],
                responses: {
                    200: {
                        description: 'Contactos y solicitudes del usuario',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserCollectionsResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/usuarios/perfil/{email}': {
            get: {
                tags: ['Usuarios'],
                summary: 'Buscar un usuario por email',
                parameters: [
                    {
                        in: 'path',
                        name: 'email',
                        required: true,
                        schema: {
                            type: 'string'
                        },
                        description: 'Email del usuario'
                    }
                ],
                responses: {
                    200: {
                        description: 'Perfil del usuario',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserProfile'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Usuario no encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/usuarios/modificar': {
            put: {
                tags: ['Usuarios'],
                summary: 'Modificar nombre o contrasena de un usuario',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UpdateUserRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Usuario actualizado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UpdateUserResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/usuarios/eliminar/{email}': {
            delete: {
                tags: ['Usuarios'],
                summary: 'Eliminar un usuario por email',
                parameters: [
                    {
                        in: 'path',
                        name: 'email',
                        required: true,
                        schema: {
                            type: 'string'
                        },
                        description: 'Email del usuario a eliminar'
                    }
                ],
                responses: {
                    200: {
                        description: 'Usuario eliminado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mensaje: {
                                            type: 'string',
                                            example: 'Usuario y datos relacionados eliminados correctamente'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Usuario no encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/contactos/agregar': {
            post: {
                tags: ['Contactos'],
                summary: 'Agregar un contacto directamente',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ContactRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Contacto agregado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/SuccessResponse'
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Solicitud invalida',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Contacto no encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/contactos/solicitar': {
            post: {
                tags: ['Contactos'],
                summary: 'Enviar solicitud de contacto',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ContactRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Solicitud enviada',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/SuccessResponse'
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Solicitud invalida',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Usuario no encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/contactos/aceptar': {
            post: {
                tags: ['Contactos'],
                summary: 'Aceptar solicitud de contacto',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AcceptContactRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Solicitud aceptada',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/SuccessResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/mensajes/limpiar-local': {
            put: {
                tags: ['Mensajes'],
                summary: 'Ocultar mensajes para un usuario',
                description: 'Marca los mensajes de un chat como borrados solo para un usuario.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/MessageActionRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Mensajes ocultados localmente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/mensajes/borrar-definitivo': {
            delete: {
                tags: ['Mensajes'],
                summary: 'Eliminar mensajes definitivamente',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/MessageActionRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Mensajes eliminados',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Error del servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

module.exports = {
    buildSwaggerSpec
};
