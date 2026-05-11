# Base e2e del proyecto

Esta carpeta deja listo un laboratorio de QA separado del codigo productivo.

## Herramientas incluidas
- Playwright para UI y smoke de API.
- Cypress para regresion rapida del frontend.
- Selenium para compatibilidad y portafolio clasico.
- Postman + Newman para API.
- Lighthouse CI como cuarta capa de calidad para frontend.

## Preparacion local
1. Copia `frontend/.env.example` a `frontend/.env.local`.
2. Copia `backend/.env.example` a `backend/.env`.
3. Copia `e2e/.env.example` a `e2e/.env`.
4. Usa una base de datos separada para pruebas.
5. Cuando solo quieras validar humo de UI o `health`, puedes dejar `SKIP_DB=true`.
6. Para pruebas reales de registro, login y chat, cambia `SKIP_DB=false` y configura `MONGO_URI` en `backend/.env`.

## Comandos utiles
- `npm run stack:up`
- `npm run test:playwright`
- `npm run test:playwright:api`
- `npm run test:cypress`
- `npm run test:selenium`
- `npm run test:newman`
- `npm run test:lighthouse`

## Orden sugerido para arrancar
1. Levantar backend y frontend desde `e2e/` con `npm run stack:up`.
2. Verificar `http://127.0.0.1:3000/api/health`.
3. Correr smoke de Playwright.
4. Correr smoke de Cypress.
5. Ejecutar Newman para API.
6. Dejar Selenium y Lighthouse como capa adicional de portafolio.

## Notas
- Playwright ya queda configurado para levantar frontend y backend automaticamente.
- Cypress, Selenium, Newman y Lighthouse asumen que el stack local ya esta arriba.
- Si Cypress no abre al primer intento, ejecuta `npx cypress install` dentro de `e2e/` para descargar su binario local.
- Los specs actuales son intencionalmente pequenos: sirven como base, no como suite final.
- La matriz de casos sugeridos vive en `docs/test-matrix.md`.
