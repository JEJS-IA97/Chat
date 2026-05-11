import { authSelectors } from '../../../cypress/selectors/authSelectors';
import { authPage } from '../pages/authPage';

describe('Validaciones de Autenticación y Búsqueda', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.fixture('users').as('userData');
    });

    it('Control de errores en Login (User no existe / Pass incorrecta)', () => {
        // Usuario inexistente
        cy.get(authSelectors.emailInput).type('no_existo@test.com');
        cy.get(authSelectors.passwordInput).type('123456');
        cy.get(authSelectors.submitButton).click();
        cy.contains('Usuario no encontrado').should('be.visible');

        // Password incorrecta
        cy.get('@userData').then((user) => {
            cy.get(authSelectors.emailInput).clear().type(user.primaryUser.email);
            cy.get(authSelectors.passwordInput).clear().type('wrong_pass');
            cy.get(authSelectors.submitButton).click();
            cy.contains('Contraseña incorrecta').should('be.visible');
        });
    });

    it('Validación de búsqueda de usuarios y mensajes', () => {
        cy.get('@userData').then((user) => {
            authPage.login(user.primaryUser.email, user.primaryUser.password);
        });

        cy.wait(2000); // Esperar a que se cargue la interfaz principal

        // Buscar contacto inexistente
        cy.get(authSelectors.searchInput).first().type('Usuario Fantasma');
        cy.contains('No hay coincidencias').should('be.visible');
        cy.get(authSelectors.searchInput).first().clear();

        // Buscar contacto existente
        cy.get(authSelectors.searchInput).first().type('José J.');
        cy.get(authSelectors.contactItem)
        .find(authSelectors.contactName).should('exist')
        .and('contain', 'José J.');

        // Buscar mensaje específico
        cy.get(authSelectors.contactItem).first().click();
        cy.get(authSelectors.lupaButton).click();
        cy.get(authSelectors.searchMessagesInput).type('test_unique_key');
        cy.get(authSelectors.chatBubbleContact).should('not.exist');
        cy.get(authSelectors.chatBubbleUser).should('not.exist');
    });
});