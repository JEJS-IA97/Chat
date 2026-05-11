import { expect, test } from '@playwright/test';

const apiBaseUrl = process.env.E2E_API_URL || 'http://127.0.0.1:3000';

test.describe('API End-to-End Flow', () => {

    const timestamp = Date.now();
    const testUser = {
        nombre: `Playwright User ${timestamp}`,
        email: `pw.${timestamp}@test.com`,
        password: 'SecurePass123!'
    };
    
    let userToken: string;

    test('01 - Registro de nuevo usuario', async ({ request }) => {
        const response = await request.post(`${apiBaseUrl}/api/auth/registro`, {
            data: testUser
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.mensaje).toBe('Usuario creado exitosamente');
    });

    test('02 - Login y obtención de JWT', async ({ request }) => {
        const response = await request.post(`${apiBaseUrl}/api/auth/login`, {
            data: {
                email: testUser.email,
                password: testUser.password
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.token).toBeDefined();
        userToken = body.token; 
    });

    test('03 - Ver perfil del usuario (Endpoint Protegido)', async ({ request }) => {
        const response = await request.get(`${apiBaseUrl}/api/usuarios/perfil/${testUser.email}`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.email).toBe(testUser.email);
        expect(body.nombre).toBe(testUser.nombre);
    });

    test('04 - Modificar datos del usuario', async ({ request }) => {
        const response = await request.put(`${apiBaseUrl}/api/usuarios/modificar`, {
            data: {
                email: testUser.email,
                nuevoNombre: `Updated Name ${timestamp}`
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.usuario.nombre).toContain('Updated Name');
    });

    test('05 - Cleanup: Eliminar usuario de prueba', async ({ request }) => {
        const response = await request.delete(`${apiBaseUrl}/api/usuarios/eliminar/${testUser.email}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.mensaje).toContain('eliminados correctamente');
    });
});
