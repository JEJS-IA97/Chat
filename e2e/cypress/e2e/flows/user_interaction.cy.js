import { authSelectors } from "../../selectors/authSelectors";
import { authPage } from "../pages/authPage";

describe('Flujo E2E: Registro, Interacción y Limpieza', () => {
    let newUser; 

    before(() => {
        cy.task('getNextId').then((id) => {
            newUser = {
                nombre: `Test_User_01`,
                email: `user01@tuapp.com`,
                password: "Password123!"
            };
        });
    });

    beforeEach(() => {
        cy.visit('/');
        cy.fixture('users').as('userData');
    });

    it('1 - Registrar nuevo usuario y agregando contacto', () => {

        authPage.verifyLoginPage();
        cy.contains('Regístrate aquí').click();
        authPage.register(newUser.nombre, newUser.email, newUser.password);

        cy.wait(2000);

        cy.contains('Cuenta creada con éxito. Ahora puedes iniciar sesión.').should('be.visible');
        authPage.login(newUser.email, newUser.password);

        cy.wait(2000);

        cy.get(authSelectors.addContactButton).first().click();
        cy.get('@userData').then((user) => {
            cy.get(authSelectors.addContactInput).first().type(user.primaryUser.email);
            cy.get(authSelectors.sendInvitationButton).first().click();
        });

        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Solicitud enviada. Esperando que acepte.');
            return true;
        });

        authPage.logout();
        cy.wait(2000);
    });

    it('2 - Iniciar sesión, aceptar contacto y enviar mensaje', () => {

        authPage.verifyLoginPage();

        cy.get('@userData').then((user) => {
            authPage.login(user.primaryUser.email, user.primaryUser.password);
            cy.get(authSelectors.acceptInvitationButton).first().click();
            cy.get(authSelectors.contactItem)
            .find(authSelectors.contactName)
            .contains(newUser.nombre).should('exist').first().click();

            cy.wait(2000);

            cy.get(authSelectors.messageInput)
            .type('Hola, soy el admin');
            cy.get(authSelectors.sendMessageButton).click();

            cy.get(authSelectors.chatBubbleUser).last()
            .should('contain', 'Hola, soy el admin');
        });

        cy.wait(2000);
        authPage.logout();
        cy.wait(2000);
    });

    it('3 - Iniciar sesion con el nuevo ususario, verificar y responder mensaje', () => {

        authPage.verifyLoginPage();
        authPage.login(newUser.email, newUser.password);

        cy.wait(2000);

        cy.get('@userData').then((user) => {
            cy.get(authSelectors.contactItem)
            .find(authSelectors.contactName)
            .contains(user.primaryUser.nombre).should('exist').first().click();

            cy.wait(2000);

            cy.get(authSelectors.chatBubbleContact).last()
            .should('contain', 'Hola, soy el admin');

            cy.get(authSelectors.messageInput)
            .type('Hola, soy el nuevo usuario');
            cy.get(authSelectors.sendMessageButton).click();

            cy.get(authSelectors.chatBubbleUser).last()
            .should('contain', 'Hola, soy el nuevo usuario');
        });

        cy.wait(2000);
        authPage.logout();
        cy.wait(2000);
    })

    it('4 - Limpiar historial de chat y verificar limpieza', () => {

        authPage.verifyLoginPage();

        cy.get('@userData').then((user) => {
        authPage.login(user.primaryUser.email, user.primaryUser.password);

        cy.wait(2000);

        cy.get(authSelectors.contactItem)
            .find(authSelectors.contactName)
            .contains(newUser.nombre).should('exist').first().click();

        cy.wait(2000);

        cy.get(authSelectors.menuOptions).first().click();
        cy.contains('Borrar para todos').click();
        });

        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Seguro que deseas eliminar todos los mensajes');
        return true;
        });

        authPage.logout();
        cy.wait(2000);
    });

    it('5 - Iniciar sesión con el nuevo usuario y verificar que el historial esté limpio', () => {

        authPage.verifyLoginPage();
        authPage.login(newUser.email, newUser.password);
        cy.wait(2000);

        cy.get('@userData').then((user) => {
            cy.get(authSelectors.contactItem)
            .find(authSelectors.contactName)
            .contains(user.primaryUser.nombre).should('exist').first().click();

            cy.wait(2000);

            cy.get(authSelectors.chatBubbleContact).should('not.exist');
            cy.get(authSelectors.chatBubbleUser).should('not.exist');
        });

        cy.wait(2000);
        authPage.logout();
        cy.wait(2000);
    });

    it('6 - Eliminar usuario de prueba desde backend', () => {
        cy.task('deleteUserByEmail', newUser.email).then((result) => {
            expect(result).to.be.true;
        });

    });

});