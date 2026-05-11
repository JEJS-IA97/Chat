import { authSelectors } from '../../../cypress/selectors/authSelectors';

export class authPage {

    static login(email, password) {
        cy.get(authSelectors.emailInput).type(email);
        cy.get(authSelectors.passwordInput).type(password);
        cy.get(authSelectors.submitButton).click();
    }

    static register(nombre, email, password) {
        cy.get(authSelectors.nombreInput).type(nombre);
        cy.get(authSelectors.emailInput).type(email);
        cy.get(authSelectors.passwordInput).type(password);
        cy.get(authSelectors.submitButton).click();
    }

    static logout() {
        cy.get(authSelectors.logoutButton).click();
    }

    static verifyLoginPage() {
        cy.get(authSelectors.emailInput).should('be.visible');
        cy.get(authSelectors.passwordInput).should('be.visible');
        cy.get(authSelectors.submitButton).should('be.visible');
    }
}