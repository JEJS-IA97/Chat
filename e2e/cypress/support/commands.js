Cypress.Commands.add('clearChatSession', () => {
    cy.clearLocalStorage();
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
});
