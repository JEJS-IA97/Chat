# Estrategia base de QA para Mi Chat App

## Objetivo
Montar una base de portafolio donde cada herramienta tenga un rol claro y no solo "mas pruebas".

## Reparto por herramienta

### Playwright
- Smoke de autenticacion.
- Flujo feliz de registro y login.
- Flujo de agregar contacto.
- Flujo de aceptar solicitud.
- Flujo de envio y recepcion de mensaje.
- Flujo de borrar chat para mi y para todos.
- API smoke con `request` para `health`, `registro` y `login`.
- Futuro: capturas, videos, trazas y pruebas de accesibilidad.

### Cypress
- Smoke visual del frontend.
- Regresion rapida de formularios y validaciones.
- Busqueda de contactos.
- Busqueda de mensajes.
- Flujo mobile con menu lateral.
- Casos con `cy.intercept()` para simular respuestas lentas o errores del backend.

### Selenium
- Suite de compatibilidad cross-browser.
- Regresion de login, cambio entre vistas y logout.
- Verificacion de soporte en Chrome y Edge.
- Casos legacy para demostrar conocimiento del stack clasico de automatizacion.

### Postman + Newman
- Contrato basico de endpoints.
- Smoke de `health`.
- Registro de usuario.
- Login y captura de token.
- Futuro: colecciones encadenadas para contactos, solicitudes y limpieza de mensajes.
- Futuro: ejecucion por CLI con reporte HTML para CI.

### Lighthouse CI
- Baseline de performance.
- Baseline de accesibilidad.
- Best practices antes de cada release visual.

## Casos recomendados por prioridad

### Prioridad 1
- Login exitoso.
- Registro exitoso.
- Login fallido.
- Carga de contactos.
- Health del backend.

### Prioridad 2
- Envio de solicitud de contacto.
- Aceptacion de solicitud.
- Envio de mensaje.
- Indicador de usuario escribiendo.
- Limpieza local de chat.

### Prioridad 3
- Borrado global de mensajes.
- Ordenamiento de conversaciones por ultimo mensaje.
- Contador de no leidos.
- Comportamiento responsive mobile.
- Auditoria Lighthouse.

## Pipeline QA inspirado en tus imagenes

### Analyst
- Traducir una user story en criterios de aceptacion y riesgo.

### Generator
- Convertir esos criterios en escenarios por herramienta.

### Automator
- Elegir si el escenario vive en Playwright, Cypress, Selenium o Postman.

### Healer
- Analizar fallos, trazas, screenshots y logs.

### Reporter
- Publicar reportes HTML de Playwright, Cypress y Newman.

### Bug Logger
- Convertir fallos repetibles en tickets con evidencia.

## Regla importante para este proyecto
- Usar frontend local para UI automation.
- Usar backend local para UI e2e.
- Usar API local o Render solo para pruebas controladas sin depender del frontend desplegado.
- Mantener una base de datos separada para QA y evitar tocar datos reales.
