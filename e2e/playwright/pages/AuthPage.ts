import { expect, Page } from '@playwright/test';

export class AuthPage {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('/');
    }

    async expectLoginView() {
        await expect(this.page.getByText('Bienvenido de vuelta')).toBeVisible();
        await expect(this.page.getByRole('button', { name: /Iniciar/i })).toBeVisible();
    }

    async switchToRegister() {
        await this.page.getByRole('button', { name: /Reg/i }).click();
    }

    async expectRegisterView() {
        await expect(this.page.getByText('Crear nueva cuenta')).toBeVisible();
        await expect(this.page.getByRole('textbox', { name: 'Nombre' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Registrarse' })).toBeVisible();
    }
}
