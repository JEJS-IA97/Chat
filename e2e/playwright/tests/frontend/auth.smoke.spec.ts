import { test } from '@playwright/test';
import { AuthPage } from '../../pages/AuthPage';

test.describe('Frontend smoke', () => {
    test('la vista de autenticacion carga y permite cambiar a registro', async ({ page }) => {
        const authPage = new AuthPage(page);

        await authPage.goto();
        await authPage.expectLoginView();
        await authPage.switchToRegister();
        await authPage.expectRegisterView();
    });
});
